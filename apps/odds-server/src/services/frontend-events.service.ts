import type { Event } from "@prisma/client";

import { findEventBySport } from "../db/repositories/event.repo.js";
import { findConfiguredLeaguesByCategoryKey } from "../db/repositories/sport.repo.js";
import { getSnapshot } from "../processing/snapshot.store.js";
import type { OddsApiEvent, OddsApiMarket, OddsApiOutcome } from "../types/odds-api.types.js";
import type { EventStatusQuery } from "./event.service.js";

type FrontendRunner = {
  runnerName: string;
  backPrices: Array<{ price: number }>;
};

type FrontendMarket = {
  key: string;
  marketType: string;
  marketName: string;
  status: "OPEN" | "SUSPENDED";
  runners: FrontendRunner[];
};

type FrontendEvent = {
  eventId: string;
  sportKey: string;
  sportName: string;
  eventName: string;
  competitionName: string;
  team1: string;
  team2: string;
  homeTeam: string | null;
  awayTeam: string | null;
  eventType: "MATCH" | "OUTRIGHT";
  openDate: string;
  status: string;
  markets: Record<string, FrontendMarket[]>;
};

function toEventStatus(status?: EventStatusQuery) {
  if (status === "live") return "LIVE";
  if (status === "pre_match") return "PRE_MATCH";
  return undefined;
}

export async function listFrontendEventsForSport(input: {
  sportKey: string;
  status?: EventStatusQuery;
  limit: number;
  offset: number;
}): Promise<{ sportKey: string; events: FrontendEvent[] }> {
  const status = toEventStatus(input.status);
  const events = await findEventBySport(input.sportKey, {
    ...(status ? { status } : {}),
    limit: input.limit,
    offset: input.offset,
  });

  const frontendEvents = await Promise.all(
    events.map(async (event) => toFrontendEvent(event, await getSnapshot(event.id))),
  );

  return { sportKey: input.sportKey, events: frontendEvents };
}

export async function listFrontendLeaguesForCategory(categoryKey: string) {
  const leagues = await findConfiguredLeaguesByCategoryKey(categoryKey);

  return {
    categoryKey,
    leagues: leagues.map((league) => ({
      key: league.key,
      title: league.title,
      sportKey: league.sportKey,
      sportName: league.sport?.name ?? league.sportName,
      regions: league.config?.regions ?? [],
      markets: league.config?.markets ?? [],
      pollIntervalMs: league.config?.pollIntervalMs ?? null,
    })),
  };
}

function toFrontendEvent(event: Event, snapshot: OddsApiEvent | null): FrontendEvent {
  const eventName = event.eventName ?? buildFallbackEventName(event);

  return {
    eventId: event.id,
    sportKey: event.leagueKey,
    sportName: snapshot?.sport_title ?? event.leagueKey,
    eventName,
    competitionName: snapshot?.sport_title ?? event.eventName ?? event.leagueKey,
    team1: event.homeTeam ?? eventName,
    team2: event.awayTeam ?? "",
    homeTeam: event.homeTeam,
    awayTeam: event.awayTeam,
    eventType: event.eventType,
    openDate: event.commenceTime.toISOString(),
    status: event.status,
    markets: buildFrontendMarkets(event, snapshot),
  };
}

function buildFrontendMarkets(event: Event, snapshot: OddsApiEvent | null): Record<string, FrontendMarket[]> {
  const status = isClosedEvent(event) ? ("SUSPENDED" as const) : ("OPEN" as const);
  const snapshotMarkets = snapshot?.bookmakers[0]?.markets ?? [];
  const grouped: Record<string, FrontendMarket[]> = {};

  for (const market of snapshotMarkets) {
    const groupKey = toFrontendMarketGroupKey(market.key);
    const frontendMarket = toFrontendMarket(market, status);
    grouped[groupKey] = [...(grouped[groupKey] ?? []), frontendMarket];
  }

  if (Object.keys(grouped).length > 0) {
    return grouped;
  }

  const fallbackKey = event.eventType === "OUTRIGHT" ? "outrights" : "h2h";
  const fallbackGroup = toFrontendMarketGroupKey(fallbackKey);
  const fallbackOutcomes = buildFallbackOutcomes(event);

  return {
    [fallbackGroup]: [{
      key: fallbackKey,
      marketType: event.eventType === "OUTRIGHT" ? "OUTRIGHT" : "MATCH_ODDS",
      marketName: event.eventType === "OUTRIGHT" ? "Outrights" : "Match Odds",
      status,
      runners: fallbackOutcomes.map((name) => toRunner(name)),
    }],
  };
}

function toFrontendMarket(market: OddsApiMarket, status: "OPEN" | "SUSPENDED"): FrontendMarket {
  return {
    key: market.key,
    marketType: toMarketType(market.key),
    marketName: humanizeMarketKey(market.key),
    status,
    runners: market.outcomes.map((outcome) => toRunner(formatOutcomeName(outcome), outcome)),
  };
}

function toFrontendMarketGroupKey(marketKey: string) {
  return marketKey === "h2h" || marketKey === "outrights" ? "matchOdds" : marketKey;
}

function toMarketType(marketKey: string) {
  if (marketKey === "h2h") return "MATCH_ODDS";
  if (marketKey === "outrights") return "OUTRIGHT";
  return marketKey.toUpperCase();
}

function humanizeMarketKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\bh2h\b/gi, "H2H")
    .replace(/\bh1\b/gi, "1st Half")
    .replace(/\bh2\b/gi, "2nd Half")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildFallbackOutcomes(event: Event) {
  if (event.eventType === "OUTRIGHT") {
    return [event.eventName ?? event.leagueKey];
  }

  const outcomes = [event.homeTeam ?? "Home"];
  if (event.leagueKey.startsWith("soccer_")) outcomes.push("Draw");
  outcomes.push(event.awayTeam ?? "Away");
  return outcomes;
}

function buildFallbackEventName(event: Event) {
  if (event.homeTeam && event.awayTeam) return `${event.awayTeam} vs ${event.homeTeam}`;
  return event.leagueKey;
}

function isClosedEvent(event: Event) {
  return ["SETTLED", "POSTPONED", "CANCELLED"].includes(event.status);
}

function formatOutcomeName(outcome: OddsApiOutcome) {
  if (typeof outcome.point !== "number") return outcome.name;
  const point = outcome.point > 0 ? `+${outcome.point}` : String(outcome.point);
  return `${outcome.name} ${point}`;
}

function toRunner(name: string, outcome?: OddsApiOutcome): FrontendRunner {
  return {
    runnerName: name,
    backPrices: typeof outcome?.price === "number" ? [{ price: outcome.price }] : [],
  };
}