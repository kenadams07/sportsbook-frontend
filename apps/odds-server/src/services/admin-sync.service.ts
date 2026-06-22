import type { EventStatus } from "@prisma/client";
import type { OddsApiSport } from "../types/odds-api.types.js";

import { findAdminEvents, upsertEventSummary } from "../db/repositories/event.repo.js";
import {
  findEnabledSportConfigs,
  findSportConfigByKey,
} from "../db/repositories/sport-config.repo.js";
import {
  findAllSportCategories,
  findAllSportsWithConfig,
  upsertSportCategoryFromGroup,
  upsertSportFromApiSport,
} from "../db/repositories/sport.repo.js";
import { getEventMarkets, getEvents, getSports } from "../ingestion/odds-api.client.js";
import { logger } from "../logger.js";
import { prisma } from "../db/client.js";
import { serializeError } from "../utils/serialize-error.js";
import { upsertSportConfig } from "../db/repositories/sport-config.repo.js";
import { restoreMarketsForEvents } from "../db/repositories/market.repo.js";

const syncLogger = logger.child({ module: "admin-sync" });

export async function listAvailableSportsFromOddsApi() {
  const sports = await getSports();

  return sports.map((sport) => ({
    key: sport.key,
    group: sport.group,
    title: sport.title,
    description: sport.description,
    active: sport.active,
    hasOutrights: sport.has_outrights,
  }));
}

export async function addSelectedSportFromOddsApi(input: OddsApiSport) {
  const league = await upsertSportFromApiSport(input);

  return {
    key: league.key,
    group: league.sportName,
    title: league.title,
    description: league.description,
    active: league.active,
    hasOutrights: league.hasOutrights,
  };
}

export async function syncSportCategoriesFromOddsApi() {
  const sports = await getSports();
  const groups = [...new Set(sports.map((sport) => sport.group || "Other"))].sort();

  for (const group of groups) {
    await upsertSportCategoryFromGroup(group);
  }

  return {
    categoryCount: groups.length,
  };
}

export async function addSelectedLeaguesFromOddsApi(input: {
  leagues: OddsApiSport[];
  regions: string[];
  markets: string[];
  enabled: boolean;
  pollIntervalMs: number | null;
}) {
  const added = [];

  for (const league of input.leagues) {
    const savedLeague = await upsertSportFromApiSport(league);
    const config = await upsertSportConfig({
      sportKey: savedLeague.key,
      regions: input.regions.length ? input.regions : ["us"],
      markets: input.markets.length ? input.markets : ["h2h"],
      enabled: input.enabled,
      pollIntervalMs: input.pollIntervalMs,
    });

    added.push({
      key: savedLeague.key,
      group: savedLeague.sportName,
      title: savedLeague.title,
      regions: config.regions,
      markets: config.markets,
      enabled: config.enabled,
      pollIntervalMs: config.pollIntervalMs,
    });
  }

  return {
    leagueCount: added.length,
    leagues: added,
  };
}

export async function listAdminSportCategories() {
  const categories = await findAllSportCategories();

  return categories.map((category) => ({
    key: category.key,
    name: category.name,
    active: category.active,
  }));
}

export async function listAdminSports() {
  const leagues = await findAllSportsWithConfig();

  return leagues.map((league) => ({
    key: league.key,
    categoryKey: league.sportKey,
    categoryName: league.sport?.name ?? league.sportName,
    group: league.sportName,
    title: league.title,
    description: league.description,
    active: league.active,
    hasOutrights: league.hasOutrights,
    config: league.config
      ? {
          regions: league.config.regions,
          markets: league.config.markets,
          enabled: league.config.enabled,
          pollIntervalMs: league.config.pollIntervalMs,
        }
      : null,
  }));
}

export async function syncEventsForSport(sportKey: string) {
  const events = await getEvents(sportKey);
  let eventCount = 0;
  let skippedEventCount = 0;

  for (const event of events) {
    const upserted = await upsertEventSummary(event);

    if (upserted) {
      eventCount += 1;
    } else {
      skippedEventCount += 1;
    }
  }

  return {
    sportKey,
    eventCount,
    skippedEventCount,
    receivedEventCount: events.length,
  };
}

export async function syncEventsForEnabledSports() {
  const configs = await findEnabledSportConfigs();
  const results = [];

  for (const config of configs) {
    try {
      results.push(await syncEventsForSport(config.leagueKey));
    } catch (error) {
      syncLogger.warn(
        { sportKey: config.leagueKey, error: serializeError(error) },
        "failed to sync events for configured sport",
      );
      results.push({
        sportKey: config.leagueKey,
        eventCount: 0,
        error: error instanceof Error ? error.message : "Failed to sync events",
      });
    }
  }

  return {
    sportCount: configs.length,
    eventCount: results.reduce((total, result) => total + result.eventCount, 0),
    results,
  };
}

export async function listAdminEvents(input: {
  sportKey?: string;
  status?: EventStatus;
  limit: number;
  offset: number;
}) {
  const events = await findAdminEvents(input);

  return events.map((event) => ({
    id: event.id,
    sportKey: event.leagueKey,
    sportTitle: event.league.title,
    homeTeam: event.homeTeam,
    awayTeam: event.awayTeam,
    commenceTime: event.commenceTime.toISOString(),
    status: event.status,
    statusSource: event.statusSource,
    markets: event.markets.map((market) => ({
      id: market.id,
      marketId: market.marketId,
      marketName: market.marketName,
      marketType: market.marketType,
      status: market.status,
      marketTime: market.marketTime.toISOString(),
      outcomes: market.outcomes.map((outcome) => ({
        id: outcome.id,
        selectionId: outcome.selectionId,
        name: outcome.name,
        status: outcome.status,
        actualStatus: outcome.actualStatus,
      })),
    })),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }));
}

export async function restoreSelectedAdminEvents(input: {
  eventIds: string[];
  marketKey: string;
}) {
  return restoreMarketsForEvents(input);
}

export async function discoverAdminEventMarkets(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      leagueKey: true,
      eventName: true,
      homeTeam: true,
      awayTeam: true,
    },
  });

  if (!event) {
    return null;
  }

  const config = await findSportConfigByKey(event.leagueKey);
  const regions = config?.regions.length ? config.regions : ["us"];
  const rawMarkets = await getEventMarkets(event.leagueKey, event.id, regions);
  const markets = normalizeDiscoveredMarkets(rawMarkets);

  return {
    eventId: event.id,
    sportKey: event.leagueKey,
    eventName: event.eventName ?? [event.homeTeam, event.awayTeam].filter(Boolean).join(" vs "),
    marketCount: markets.length,
    markets,
  };
}

type DiscoveredMarket = {
  key: string;
  name: string;
  description?: string | null;
};

function normalizeDiscoveredMarkets(raw: unknown): DiscoveredMarket[] {
  const candidates = extractMarketCandidates(raw);
  const byKey = new Map<string, DiscoveredMarket>();

  for (const candidate of candidates) {
    const market = normalizeMarketCandidate(candidate);

    if (market && !byKey.has(market.key)) {
      byKey.set(market.key, market);
    }
  }

  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function extractMarketCandidates(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => extractMarketCandidates(item));
  }

  if (!raw || typeof raw !== "object") {
    return [];
  }

  const objectRaw = raw as Record<string, unknown>;
  const directMarkets = objectRaw.markets;

  if (Array.isArray(directMarkets)) {
    return directMarkets;
  }

  // The event-markets endpoint groups available markets under each bookmaker.
  // Collect those nested lists instead of treating the event object as a market.
  const bookmakers = objectRaw.bookmakers;
  if (Array.isArray(bookmakers)) {
    return bookmakers.flatMap((bookmaker) => extractMarketCandidates(bookmaker));
  }

  for (const key of ["data", "results"]) {
    const value = objectRaw[key];
    if (value) {
      return extractMarketCandidates(value);
    }
  }

  return [];
}

function normalizeMarketCandidate(candidate: unknown): DiscoveredMarket | null {
  if (typeof candidate === "string") {
    return {
      key: candidate,
      name: humanizeMarketKey(candidate),
      description: null,
    };
  }

  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const objectCandidate = candidate as Record<string, unknown>;
  const key = stringValue(objectCandidate.key) ?? stringValue(objectCandidate.market_key) ?? stringValue(objectCandidate.id);

  if (!key) {
    return null;
  }

  return {
    key,
    name: stringValue(objectCandidate.name) ?? stringValue(objectCandidate.title) ?? humanizeMarketKey(key),
    description: stringValue(objectCandidate.description) ?? null,
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function humanizeMarketKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function startConfiguredEventSync(intervalMs: number) {
  let running = false;

  const sync = async () => {
    if (running) {
      return;
    }

    running = true;
    try {
      const result = await syncEventsForEnabledSports();
      syncLogger.info(result, "configured events sync completed");
    } catch (error) {
      syncLogger.warn({ error: serializeError(error) }, "configured events sync failed");
    } finally {
      running = false;
    }
  };

  const interval = setInterval(() => {
    void sync();
  }, intervalMs);

  void sync();

  return {
    stop: () => clearInterval(interval),
  };
}


