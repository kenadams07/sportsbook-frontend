import { buildServer } from "./api/server.js";
import { env } from "./config/index.js";
import { connectDb, disconnectDb } from "./db/client.js";
import {
  startFakeOddsPublisher,
  type FakeOddsPublisher,
} from "./dev/fake-odds.publisher.js";
import { pollQueue } from "./ingestion/poll.queue.js";
import { createPollerWorker } from "./ingestion/poller.worker.js";
import { connectRedis, disconnectRedis } from "./redis/client.js";
import { startConfiguredSportPollJobs } from "./ingestion/scheduler.service.js";
import { logger } from "./logger.js";
import { serializeError } from "./utils/serialize-error.js";
import { startConfiguredEventSync } from "./services/admin-sync.service.js";

const server = await buildServer(logger);
let pollerWorker: ReturnType<typeof createPollerWorker> | null = null;
let fakeOddsPublisher: FakeOddsPublisher | null = null;
let eventSyncScheduler: { stop: () => void } | null = null;
let isShuttingDown = false;

async function shutdown(signal: string, exitcode = 0) {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  logger.info({ signal }, "shutting down");
  const result = await Promise.allSettled([
    Promise.resolve(eventSyncScheduler?.stop()),
    Promise.resolve(fakeOddsPublisher?.stop()),
    pollerWorker?.close(),
    pollQueue.close(),
    server.close(),
    disconnectRedis(),
    disconnectDb(),
  ]);
  const failures = result.filter((result) => result.status === "rejected");

  if (failures.length > 0) {
    logger.error({ failures }, "shutdown completed with errors");
  }
  process.exit(exitcode);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error({ reason: serializeError(reason) }, "unhandled rejection");
  void shutdown("unhandledRejection", 1);
});

process.on("uncaughtException", (error) => {
  logger.fatal({ error: serializeError(error) }, "uncaught exception");
  void shutdown("uncaughtException", 1);
});

async function bootstrap() {
  logger.info("starting odds server");

  await connectRedis();
  logger.info(
    { host: env.REDIS_HOST, port: env.REDIS_PORT },
    "redis connected",
  );

  await connectDb();
  logger.info("postgres connected");

  if (!env.FAKE_ODDS_ENABLED) {
    pollerWorker = createPollerWorker();

    pollerWorker.on("completed", (job, result) => {
      logger.info(
        { jobId: job.id, jobName: job.name, result },
        "poll job completed",
      );
    });

    pollerWorker.on("failed", (job, error) => {
      logger.error(
        { jobId: job?.id, jobName: job?.name, error },
        "poll job failed",
      );
    });
    logger.info("poller worker started");

    const scheduledSports = await startConfiguredSportPollJobs();
    logger.info({ scheduledSports }, "configured sport poll jobs started");
  } else {
    logger.warn("fake odds enabled; real poller worker and scheduler disabled");
  }

  fakeOddsPublisher = startFakeOddsPublisher();

  if (env.ODDS_API_KEY) {
    eventSyncScheduler = startConfiguredEventSync(env.EVENT_SYNC_INTERVAL_MS);
    logger.info(
      { intervalMs: env.EVENT_SYNC_INTERVAL_MS },
      "configured event sync scheduler started",
    );
  } else {
    logger.warn("ODDS_API_KEY is empty; configured event sync scheduler disabled");
  }

  await server.listen({ host: "0.0.0.0", port: env.PORT });
  logger.info({ port: env.PORT }, "odds server ready");
}

bootstrap().catch((error) => {
  logger.error({ error: serializeError(error) }, "failed to start odds server");
  process.exit(1);
});
