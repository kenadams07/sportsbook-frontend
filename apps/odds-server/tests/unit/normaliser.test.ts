import { describe, expect, it, vi } from "vitest";

import { normaliseDeltas } from "../../src/processing/normaliser.js";
import type { RawOddsDelta } from "../../src/types/internal.types.js";
import type { OddsApiEvent } from "../../src/types/odds-api.types.js";

const event: OddsApiEvent = {
  id: "event-1",
  sport_key: "baseball_mlb",
  sport_title: "MLB",
  commence_time: "2026-06-06T17:11:00Z",
  home_team: "Detroit Tigers",
  away_team: "Seattle Mariners",
  bookmakers: [
    {
      key: "draftkings",
      title: "DraftKings",
      last_update: "2026-06-06T12:00:00Z",
      markets: [
        {
          key: "h2h",
          last_update: "2026-06-06T12:00:00Z",
          outcomes: [
            { name: "Detroit Tigers", price: 2 },
            { name: "Seattle Mariners", price: 1.91 },
          ],
        },
      ],
    },
  ],
};

const rawDelta: RawOddsDelta = {
  eventId: "event-1",
  sportKey: "baseball_mlb",
  homeTeam: "Detroit Tigers",
  awayTeam: "Seattle Mariners",
  commenceTime: "2026-06-06T17:11:00Z",
  bookmaker: "draftkings",
  market: "h2h",
  outcome: "Detroit Tigers",
  price: 2,
  prevPrice: 1.9,
  point: null,
  moved: "up",
};

describe("normaliseDeltas", () => {
  it("adds implied probability, overround, and timestamp", () => {
    vi.spyOn(Date, "now").mockReturnValue(123456789);

    const deltas = normaliseDeltas(event, [rawDelta]);

    expect(deltas).toEqual([
      {
        ...rawDelta,
        impliedProb: 0.5,
        overround: 1.024,
        ts: 123456789,
      },
    ]);

    vi.restoreAllMocks();
  });
});
