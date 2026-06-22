import { env } from "../config/index.js";
import { findEnabledSportConfigs } from "../db/repositories/sport-config.repo.js";
import { pollQueue } from "./poll.queue.js";
import type { PollJobData } from "./poll.queue.js";

export type PollScheduleConfig = PollJobData & {
  intervalMs: number;
};

export type SchedulableSportConfig = {
  pollIntervalMs: number | null;
};

export function getScheduleIntervalMs(config: SchedulableSportConfig) {
  return config.pollIntervalMs ?? env.POLL_INTERVAL_PREMATCH;
}

function schedulerId(sportKey: string) {
  return `poll-${sportKey}`;
}

export async function addSportPollJob(
  config: PollScheduleConfig,
): Promise<void> {
  await pollQueue.upsertJobScheduler(
    schedulerId(config.sportKey),
    {
      every: config.intervalMs,
    },
    {
      name: schedulerId(config.sportKey),
      data: {
        sportKey: config.sportKey,
        regions: config.regions,
        markets: config.markets,
      },
      opts: {
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    },
  );
}

export async function removeSportPollJob(sportKey: string): Promise<void> {
  await pollQueue.removeJobScheduler(schedulerId(sportKey));
}

export async function startConfiguredSportPollJobs(): Promise<number> {
  const configs = await findEnabledSportConfigs();

  for (const config of configs) {
    await addSportPollJob({
      sportKey: config.leagueKey,
      regions: config.regions,
      markets: config.markets,
      intervalMs: getScheduleIntervalMs(config),
    });
  }

  return configs.length;
}
