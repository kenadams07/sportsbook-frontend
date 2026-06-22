import { Worker } from "bullmq";

import { env } from "../config/index.js";
import { keys } from "../redis/keys.js";
import type { PollJobData } from "./poll.queue.js";
import { processPollResult } from "./process-poll-result.js";
import { QuotaPausedError } from "./quota.guard.js";

export function createPollerWorker() {
  return new Worker<PollJobData>(
    keys.queue.poll,
    async (job) => {
      try {
        return await processPollResult(
          job.data.sportKey,
          job.data.regions,
          job.data.markets,
        );
      } catch (error) {
        if (error instanceof QuotaPausedError) {
          return {
            sportKey: job.data.sportKey,
            eventCount: 0,
            deltaCount: 0,
            skipped: "quota_paused",
          };
        }

        throw error;
      }
    },
    {
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
      },
      concurrency: env.BULL_CONCURRENCY,
    },
  );
}