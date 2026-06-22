import type { Event } from "@prisma/client";

import { env } from "../config/index.js";
import { prisma } from "../db/client.js";
import { findEnabledSportConfigs } from "../db/repositories/sport-config.repo.js";
import { logger } from "../logger.js";
import { setSnapshot } from "../processing/snapshot.store.js";
import { publishOddsDeltas } from "../publisher/redis.publisher.js";
import type { OddsApiEvent } from "../types/odds-api.types.js";
import type { OddsDelta, Movement } from "../types/internal.types.js";

const fakeLogger = logger.child({ module: "fake-odds-publisher" });
const BOOKMAKER_KEY = "draftkings";
const BOOKMAKER_TITLE = "DraftKings Dev Fake";
const DEFAULT_FAKE_MARKETS = ["h2h", "spreads", "totals"];

type FakeOddsState = {
  event: OddsApiEvent;
  markets: Map<string, Map<string, number>>;
  marketCursor: number;
};

export type FakeOddsPublisher = { stop: () => void };

const stateByEventId = new Map<string, FakeOddsState>();

export function startFakeOddsPublisher(): FakeOddsPublisher | null {
  if (!env.FAKE_ODDS_ENABLED) return null;

  let running = false;
  const interval = setInterval(() => {
    if (running) return;
    running = true;
    void publishFakeTick().finally(() => { running = false; });
  }, env.FAKE_ODDS_INTERVAL_MS);

  void publishFakeTick();
  fakeLogger.info({ configuredSportKeys: parseSportKeys(), intervalMs: env.FAKE_ODDS_INTERVAL_MS }, "fake odds publisher started");

  return {
    stop: () => {
      clearInterval(interval);
      fakeLogger.info("fake odds publisher stopped");
    },
  };
}

function parseSportKeys() {
  return env.FAKE_ODDS_SPORTS.split(",").map((key) => key.trim()).filter(Boolean);
}

async function getConfiguredMarketsBySport() {
  const configs = await findEnabledSportConfigs();
  return new Map(configs.map((config) => [config.leagueKey, config.markets.length ? config.markets : DEFAULT_FAKE_MARKETS]));
}

async function publishFakeTick() {
  const configuredMarketsBySport = await getConfiguredMarketsBySport();
  const sportKeys = [...new Set([...parseSportKeys(), ...configuredMarketsBySport.keys()])];

  if (sportKeys.length === 0) {
    fakeLogger.debug("fake odds tick skipped; no configured sports");
    return;
  }

  for (const sportKey of sportKeys) {
    const events = await prisma.event.findMany({
      where: { leagueKey: sportKey, eventType: "MATCH", status: { in: ["PRE_MATCH", "LIVE"] } },
      orderBy: { commenceTime: "asc" },
      take: 50,
    });
    const marketKeys = configuredMarketsBySport.get(sportKey) ?? DEFAULT_FAKE_MARKETS;
    const deltas: OddsDelta[] = [];

    for (const event of events) {
      const state = getOrCreateState(event, marketKeys);
      const primaryDelta = moveOneOutcome(state, "h2h");
      const rotatingDeltas = moveRotatingMarketOutcomes(state, 6);
      refreshEventSnapshot(state);
      await setSnapshot(state.event);
      if (primaryDelta) deltas.push(primaryDelta);
      deltas.push(...rotatingDeltas);
    }

    if (deltas.length > 0) await publishOddsDeltas(sportKey, deltas);
    fakeLogger.debug({ sportKey, eventCount: events.length, marketCount: marketKeys.length, deltaCount: deltas.length }, "fake odds tick completed");
  }
}

function getOrCreateState(event: Event, marketKeys: string[]): FakeOddsState {
  if (!event.homeTeam || !event.awayTeam) {
    throw new Error(`Cannot create fake match odds for event without teams: ${event.id}`);
  }

  const existing = stateByEventId.get(event.id);
  if (existing) {
    ensureMarkets(existing, marketKeys);
    return existing;
  }

  const state: FakeOddsState = {
    event: {
      id: event.id,
      sport_key: event.leagueKey,
      sport_title: event.leagueKey,
      commence_time: event.commenceTime.toISOString(),
      home_team: event.homeTeam,
      away_team: event.awayTeam,
      bookmakers: [],
    },
    markets: new Map(),
  marketCursor: 0,
    };

  ensureMarkets(state, marketKeys);
  stateByEventId.set(event.id, state);
  return state;
}

function ensureMarkets(state: FakeOddsState, marketKeys: string[]) {
  for (const marketKey of marketKeys) {
    if (!state.markets.has(marketKey)) {
      state.markets.set(marketKey, createFakeOutcomes(marketKey, state.event));
    }
  }
}

function createFakeOutcomes(marketKey: string, event: OddsApiEvent) {
  const home = event.home_team ?? "Home";
  const away = event.away_team ?? "Away";
  const soccer = event.sport_key.startsWith("soccer_");
  const names = (() => {
    if (marketKey.startsWith("player_")) return ["Home Player 1", "Home Player 2", "Home Player 3", "Away Player 1", "Away Player 2", "Away Player 3"];
    if (marketKey.includes("halftime_fulltime")) return ["Home/Home", "Home/Draw", "Home/Away", "Draw/Home", "Draw/Draw", "Draw/Away", "Away/Home", "Away/Draw", "Away/Away"];
    if (marketKey.includes("double_chance")) return ["1X", "12", "X2"];
    if (marketKey.includes("draw_no_bet")) return [home, away];
    if (marketKey.includes("btts")) return ["Yes", "No"];
    if (marketKey.includes("odd_even")) return ["Odd", "Even"];
    if (marketKey.includes("total")) return ["Over", "Under"];
    if (marketKey.includes("spread")) return [home, away];
    if (marketKey.startsWith("h2h")) return soccer || marketKey.includes("3_way") ? [home, "Draw", away] : [home, away];
    return soccer ? [home, "Draw", away] : [home, away];
  })();

  return new Map(names.map((name) => [name, randomPrice(1.35, 7.5)]));
}

function moveOneOutcome(state: FakeOddsState, preferredMarketKey?: string): OddsDelta | null {
  const marketEntries = preferredMarketKey && state.markets.has(preferredMarketKey)
    ? [[preferredMarketKey, state.markets.get(preferredMarketKey)!] as const]
    : [...state.markets.entries()];
  if (marketEntries.length === 0) return null;

  const [marketKey, outcomes] = marketEntries[Math.floor(Math.random() * marketEntries.length)] ?? [];
  if (!marketKey || !outcomes) return null;
  const outcomeNames = [...outcomes.keys()];
  const outcome = outcomeNames[Math.floor(Math.random() * outcomeNames.length)];
  if (!outcome) return null;

  const prevPrice = outcomes.get(outcome) ?? 2;
  const price = clampPrice(prevPrice + randomPrice(-0.12, 0.12));
  if (price === prevPrice) return null;
  outcomes.set(outcome, price);

  const moved: Movement = price > prevPrice ? "up" : "down";
  return {
    sportKey: state.event.sport_key,
    eventId: state.event.id,
    eventName: `${state.event.away_team} vs ${state.event.home_team}`,
    eventType: "MATCH",
    homeTeam: state.event.home_team,
    awayTeam: state.event.away_team,
    commenceTime: state.event.commence_time,
    bookmaker: BOOKMAKER_KEY,
    market: marketKey,
    outcome,
    price,
    prevPrice,
    point: getFakePoint(marketKey, outcome, state.event.home_team),
    moved,
    impliedProb: round3(1 / price),
    overround: calculateOverround([...outcomes.values()]),
    ts: Date.now(),
  };
}

function moveRotatingMarketOutcomes(state: FakeOddsState, batchSize: number) {
  const marketKeys = [...state.markets.keys()].filter((marketKey) => marketKey !== "h2h");
  if (marketKeys.length === 0) return [];

  const deltas: OddsDelta[] = [];
  for (let index = 0; index < Math.min(batchSize, marketKeys.length); index += 1) {
    const marketKey = marketKeys[state.marketCursor % marketKeys.length];
    state.marketCursor = (state.marketCursor + 1) % marketKeys.length;
    if (!marketKey) continue;

    const delta = moveOneOutcome(state, marketKey);
    if (delta) deltas.push(delta);
  }

  return deltas;
}

function refreshEventSnapshot(state: FakeOddsState) {
  const now = new Date().toISOString();
  state.event.bookmakers = [{
    key: BOOKMAKER_KEY,
    title: BOOKMAKER_TITLE,
    last_update: now,
    markets: [...state.markets.entries()].map(([key, outcomes]) => ({
      key,
      last_update: now,
      outcomes: [...outcomes.entries()].map(([name, price]) => ({ name, price, point: getFakePoint(key, name, state.event.home_team) })),
    })),
  }];
}

function getFakePoint(marketKey: string, outcome: string, homeTeam: string | null) {
  if (marketKey.includes("spread")) return outcome === homeTeam ? -1.5 : 1.5;
  if (marketKey.includes("total")) return 2.5;
  return null;
}

function randomPrice(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function clampPrice(price: number) {
  return Number(Math.min(15, Math.max(1.01, price)).toFixed(2));
}

function calculateOverround(prices: number[]) {
  return round3(prices.reduce((sum, price) => sum + 1 / price, 0));
}

function round3(value: number) {
  return Number(value.toFixed(3));
}