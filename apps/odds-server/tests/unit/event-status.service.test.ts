import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  updateEventStatusByAdmin,
  updateEventStatusIfNotAdmin,
  updateEventStatusSource,
} from "../../src/db/repositories/event.repo.js";
import { getScores } from "../../src/ingestion/odds-api.client.js";
import {
  releaseEventStatusToSystem,
  setEventStatusByAdmin,
  syncEventStatusesFromScores,
} from "../../src/services/event-status.service.js";
import type { OddsApiScore } from "../../src/types/odds-api.types.js";

vi.mock("../../src/ingestion/odds-api.client.js", () => ({
  getScores: vi.fn(),
}));

vi.mock("../../src/db/repositories/event.repo.js", () => ({
  updateEventStatusByAdmin: vi.fn(),
  updateEventStatusIfNotAdmin: vi.fn(),
  updateEventStatusSource: vi.fn(),
}));

function makeScore(input: Partial<OddsApiScore> = {}): OddsApiScore {
  return {
    id: "event-1",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: "2020-01-01T00:00:00.000Z",
    completed: false,
    home_team: "Detroit Tigers",
    away_team: "Seattle Mariners",
    scores: null,
    last_update: null,
    ...input,
  };
}

describe("event status service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("syncs statuses from scores and counts actual DB updates", async () => {
    vi.mocked(getScores).mockResolvedValue([
      makeScore({
        id: "live-event",
        scores: [{ name: "Detroit Tigers", score: "4" }],
      }),
      makeScore({
        id: "admin-owned-event",
        completed: true,
      }),
    ]);
    vi.mocked(updateEventStatusIfNotAdmin)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);

    const result = await syncEventStatusesFromScores("baseball_mlb");

    expect(result).toEqual({
      sportKey: "baseball_mlb",
      checked: 2,
      updated: 1,
    });
    expect(updateEventStatusIfNotAdmin).toHaveBeenNthCalledWith(
      1,
      "live-event",
      "LIVE",
      "SCORES_API",
    );
    expect(updateEventStatusIfNotAdmin).toHaveBeenNthCalledWith(
      2,
      "admin-owned-event",
      "SETTLED",
      "SCORES_API",
    );
  });

  it("sets event status through the admin repository path", async () => {
    vi.mocked(updateEventStatusByAdmin).mockResolvedValue({
      id: "event-1",
      status: "POSTPONED",
    } as never);

    await setEventStatusByAdmin({
      eventId: "event-1",
      status: "POSTPONED",
    });

    expect(updateEventStatusByAdmin).toHaveBeenCalledWith(
      "event-1",
      "POSTPONED",
    );
  });

  it("releases event status control back to the system", async () => {
    vi.mocked(updateEventStatusSource).mockResolvedValue({
      id: "event-1",
      statusSource: "SYSTEM",
    } as never);

    await releaseEventStatusToSystem("event-1");

    expect(updateEventStatusSource).toHaveBeenCalledWith("event-1", "SYSTEM");
  });
});
