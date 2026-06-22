import { describe, expect, it } from "vitest";

import { diffEventOdds } from "../../src/processing/diff.engine.js";
import type { OddsApiEvent } from "../../src/types/odds-api.types.js";

function makeEvent(price: number, point?: number | null): OddsApiEvent {
  return {
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
              {
                name: "Detroit Tigers",
                price,
                point,
              },
            ],
          },
        ],
      },
    ],
  };
}

describe("diffEventOdds", () => {
  it("marks all current outcomes as new when there is no previous snapshot", () => {
    const deltas = diffEventOdds(null, makeEvent(2));

    expect(deltas).toHaveLength(1);
    expect(deltas[0]).toMatchObject({
      eventId: "event-1",
      sportKey: "baseball_mlb",
      bookmaker: "draftkings",
      market: "h2h",
      outcome: "Detroit Tigers",
      price: 2,
      prevPrice: null,
      moved: "new",
    });
  });

  it("returns no deltas when price and point are unchanged", () => {
    const previous = makeEvent(2);
    const current = makeEvent(2);

    expect(diffEventOdds(previous, current)).toEqual([]);
  });

  it("marks movement up when price increases", () => {
    const previous = makeEvent(1.9);
    const current = makeEvent(2.1);

    expect(diffEventOdds(previous, current)).toMatchObject([
      {
        price: 2.1,
        prevPrice: 1.9,
        moved: "up",
      },
    ]);
  });

  it("marks movement down when price decreases", () => {
    const previous = makeEvent(2.2);
    const current = makeEvent(1.8);

    expect(diffEventOdds(previous, current)).toMatchObject([
      {
        price: 1.8,
        prevPrice: 2.2,
        moved: "down",
      },
    ]);
  });

  it("emits a delta when point changes even if price is unchanged", () => {
    const previous = makeEvent(1.91, 1.5);
    const current = makeEvent(1.91, 2.5);

    expect(diffEventOdds(previous, current)).toMatchObject([
      {
        price: 1.91,
        prevPrice: 1.91,
        point: 2.5,
      },
    ]);
  });
});
