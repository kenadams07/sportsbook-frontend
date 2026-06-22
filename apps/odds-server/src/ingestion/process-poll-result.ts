import { logger } from "../logger.js";
import { processEventOdds } from "../processing/process-event.js";
import { publishOddsDeltas } from "../publisher/redis.publisher.js";
import { isSportKeyPaused } from "../redis/paused-sports.store.js";
import { getSubscriberCount } from "../redis/subscriber-count.store.js";
import { syncEventStatusesFromScores } from "../services/event-status.service.js";
import { persistEventOdds } from "../services/odds-persistence.service.js";
import { serializeError } from "../utils/serialize-error.js";
import { getOdds } from "./odds-api.client.js";

const pollLogger = logger.child({ module: "process-poll-result" });

export async function processPollResult(
  sportKey: string,
  regions: string[],
  markets: string[],
): Promise<{
  sportKey: string;
  eventCount: number;
  deltaCount: number;  skipped?: "paused" | "no_subscribers";
}> {
  const startedAt = Date.now();

  if (await isSportKeyPaused(sportKey)) {
    pollLogger.info(
      { phase: "poll", sportKey, regions, markets, skipped: "paused" },
      "poll skipped because sport is paused",
    );

    return {
      sportKey,
      eventCount: 0,
      deltaCount: 0,
      skipped: "paused",
    };
  }

  const subscriberCount = await getSubscriberCount(sportKey);

  if (subscriberCount === 0) {
    pollLogger.info(
      { phase: "poll", sportKey, regions, markets, skipped: "no_subscribers" },
      "poll skipped because there are no subscribers",
    );

    return {
      sportKey,
      eventCount: 0,
      deltaCount: 0,
      skipped: "no_subscribers",
    };
  }

  pollLogger.info(
    { phase: "poll", sportKey, regions, markets },
    "poll started",
  );

  const events = await getOdds(sportKey, regions, markets);
  let totalDeltas = 0;
  let publishedEvents = 0;

  for (const event of events) {
    const deltas = await processEventOdds(event);

    if (deltas.length === 0) {
      continue;
    }

    await publishOddsDeltas(sportKey, deltas);
    publishedEvents += 1;

    void persistEventOdds(event, deltas).catch((error) => {
      pollLogger.error(
        {
          phase: "persist",
          sportKey,
          eventId: event.id,
          deltaCount: deltas.length,
          error: serializeError(error),
        },
        "failed to persist odds event",
      );
    });

    totalDeltas += deltas.length;
  }

  pollLogger.info(
    {
      phase: "poll",
      sportKey,
      eventCount: events.length,
      publishedEvents,
      deltaCount: totalDeltas,
      durationMs: Date.now() - startedAt,
    },
    "poll completed",
  );

  if (markets.includes("h2h")) {
    void syncEventStatusesFromScores(sportKey)
      .then((result) => {
        pollLogger.info(
          { phase: "scores-sync", ...result },
          "event statuses synced from scores",
        );
      })
      .catch((error) => {
        pollLogger.warn(
          { phase: "scores-sync", sportKey, error: serializeError(error) },
          "failed to sync event statuses from scores",
        );
      });
  }

  return { sportKey, eventCount: events.length, deltaCount: totalDeltas };
}

