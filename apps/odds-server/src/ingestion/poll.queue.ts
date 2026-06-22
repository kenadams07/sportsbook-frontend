import { Queue } from "bullmq";
import { env } from "../config/index.js";
import { keys } from "../redis/keys.js";

export type PollJobData = {
 sportKey: string;
 regions: string[];
 markets: string[];   
}

export const pollQueue = new Queue<PollJobData>(keys.queue.poll, {
  connection: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

