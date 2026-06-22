import type { OddsDelta, RawOddsDelta } from "../types/internal.types.js";
import type { OddsApiEvent } from "../types/odds-api.types.js";

export function normaliseDeltas(event: OddsApiEvent, deltas: RawOddsDelta[]): OddsDelta[] {
const overroundByMarket = buildOverroundMap(event);
const ts = Date.now();

return deltas.map((delta) => ({
    ...delta,
    impliedProb: round(1 / delta.price),
    overround: overroundByMarket.get(buildMarketKey(delta.bookmaker, delta.market)) ?? 0,
    ts,
}))
}


function buildOverroundMap(event: OddsApiEvent) {
  const overroundByMarket = new Map<string, number>();

  for (const bookmaker of event.bookmakers) {
    for (const market of bookmaker.markets) {
      const overround = market.outcomes.reduce(
        (sum, outcome) => sum + 1 / outcome.price,
        0,
      );

      overroundByMarket.set(
        buildMarketKey(bookmaker.key, market.key),
        round(overround),
      );
    }
  }

  return overroundByMarket;
}

function buildMarketKey(bookmaker: string, market: string) {
  return `${bookmaker}:${market}`;
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
