import { describe, expect, it } from "vitest";

import {
  resolveEventStatusFromCommenceTime,
  resolveEventStatusFromScore,
} from "../../src/processing/event-status.resolver.js";
import type { OddsApiScore } from "../../src/types/odds-api.types.js";

function makeScore(input: Partial<OddsApiScore> = {}): OddsApiScore {
  return {
    id: "event-1",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2026-06-09T10:00:00.000Z",
    completed: false,
    home_team: "Detroit Tigers",
    away_team: "Seattle Mariners",
    scores: null,
    last_update: null,
    ...input,
  };
}

describe("event status resolver", () => {
  it("marks completed score events as settled", () => {
    expect(
      resolveEventStatusFromScore(
        makeScore({
          completed: true,
          scores: [{ name: "Detroit Tigers", score: "4" }],
        }),
      ),
    ).toBe("SETTLED");
  });

  it("marks score events with active scores as live", () => {
    expect(
      resolveEventStatusFromScore({
        ...makeScore(),
        scores: [{ name: "Detroit Tigers", score: "4" }],
      }),
    ).toBe("LIVE");
  });

  it("falls back to commence time when score data is absent", () => {
    expect(
      resolveEventStatusFromScore(
        makeScore({ commence_time: "2020-01-01T00:00:00.000Z" }),
      ),
    ).toBe("LIVE");
  });

  it("marks future commence times as pre-match", () => {
    expect(
      resolveEventStatusFromCommenceTime(
        "2026-06-09T12:00:01.000Z",
        new Date("2026-06-09T12:00:00.000Z"),
      ),
    ).toBe("PRE_MATCH");
  });

  it("marks started commence times as live", () => {
    expect(
      resolveEventStatusFromCommenceTime(
        "2026-06-09T12:00:00.000Z",
        new Date("2026-06-09T12:00:00.000Z"),
      ),
    ).toBe("LIVE");
  });
});
