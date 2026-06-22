import { logger } from "../logger.js";
import type { OddsDelta } from "../types/internal.types.js";
import type { OddsApiEvent } from "../types/odds-api.types.js";
import { diffEventOdds } from "./diff.engine.js";
import { normaliseDeltas } from "./normaliser.js";
import { getSnapshot, setSnapshot } from "./snapshot.store.js";

const processEventLogger = logger.child({ module: "process-event" });

export async function processEventOdds(
  event: OddsApiEvent,
): Promise<OddsDelta[]> {
  const startedAt = Date.now();
  const previousSnapshot = await getSnapshot(event.id);
  const rawDeltas = diffEventOdds(previousSnapshot, event);

  await setSnapshot(event);

  if (rawDeltas.length === 0) {
    processEventLogger.debug(
      {
        phase: "diff",
        sportKey: event.sport_key,
        eventId: event.id,
        deltaCount: 0,
        snapshotMiss: previousSnapshot === null,
        durationMs: Date.now() - startedAt,
      },
      "event odds unchanged",
    );

    return [];
  }

  const deltas = normaliseDeltas(event, rawDeltas);

  processEventLogger.info(
    {
      phase: "diff",
      sportKey: event.sport_key,
      eventId: event.id,
      deltaCount: deltas.length,
      snapshotMiss: previousSnapshot === null,
      durationMs: Date.now() - startedAt,
    },
    "event odds deltas computed",
  );

  return deltas;
}
