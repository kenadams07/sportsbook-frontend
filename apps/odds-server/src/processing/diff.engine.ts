import type { RawOddsDelta } from "../types/internal.types.js";
import type { OddsApiEvent } from "../types/odds-api.types.js";

const PRICE_TOLERANCE = 0.0001;

export function diffEventOdds(previous: OddsApiEvent | null, current: OddsApiEvent): RawOddsDelta[] {
  const previousOutcomes = new Map<string, { price: number; point: number | null }>();

  if (previous) {
    for (const bookmaker of previous.bookmakers) {
      for (const market of bookmaker.markets) {
        for (const outcome of market.outcomes) {
          const key = buildOutcomeKey(bookmaker.key, market.key, outcome.name);
          previousOutcomes.set(key, { price: outcome.price, point: outcome.point ?? null });
        }
      }
    }
  }

  const eventIdentity = getEventIdentity(current);
  const deltas: RawOddsDelta[] = [];

  for (const bookmaker of current.bookmakers) {
    for (const market of bookmaker.markets) {
      for (const outcome of market.outcomes) {
        const key = buildOutcomeKey(bookmaker.key, market.key, outcome.name);
        const previousOutcome = previousOutcomes.get(key);

        if (!previousOutcome) {
          deltas.push({
            eventId: current.id,
            sportKey: current.sport_key,
            ...eventIdentity,
            commenceTime: current.commence_time,
            bookmaker: bookmaker.key,
            market: market.key,
            outcome: outcome.name,
            price: outcome.price,
            prevPrice: null,
            point: outcome.point ?? null,
            moved: "new",
          });

          continue;
        }

        const priceChanged =
          Math.abs(outcome.price - previousOutcome.price) > PRICE_TOLERANCE;

        const pointChanged = (outcome.point ?? null) !== previousOutcome.point;

        if (!priceChanged && !pointChanged) {
          continue;
        }

        deltas.push({
          eventId: current.id,
          sportKey: current.sport_key,
          ...eventIdentity,
          commenceTime: current.commence_time,
          bookmaker: bookmaker.key,
          market: market.key,
          outcome: outcome.name,
          price: outcome.price,
          prevPrice: previousOutcome.price,
          point: outcome.point ?? null,
          moved: outcome.price > previousOutcome.price ? "up" : "down",
        });
      }
    }
  }

  return deltas;
}

function getEventIdentity(event: OddsApiEvent) {
  const homeTeam = event.home_team?.trim() || null;
  const awayTeam = event.away_team?.trim() || null;

  if (homeTeam && awayTeam) {
    return {
      eventName: `${awayTeam} vs ${homeTeam}`,
      eventType: "MATCH" as const,
      homeTeam,
      awayTeam,
    };
  }

  return {
    eventName: event.sport_title || event.sport_key,
    eventType: "OUTRIGHT" as const,
    homeTeam: null,
    awayTeam: null,
  };
}

function buildOutcomeKey(bookmaker: string, market: string, outcome: string) {
  return `${bookmaker}:${market}:${outcome}`;
}
