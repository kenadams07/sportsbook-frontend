import { findSportConfigByKey } from "../db/repositories/sport-config.repo.js";
import { pollQueue } from "../ingestion/poll.queue.js";
import {
  pauseSportKey,
  resumeSportKey,
} from "../redis/paused-sports.store.js";

export async function pauseSport(sportKey: string): Promise<void> {
  await pauseSportKey(sportKey);
}

export async function resumeSport(sportKey: string): Promise<void> {
  await resumeSportKey(sportKey);
}

export async function forcePollSport(sportKey: string) {
  const config = await findSportConfigByKey(sportKey);

  if (!config) {
    return null;
  }

  const job = await pollQueue.add(
    `force-poll-${sportKey}-${Date.now()}`,
    {
      sportKey: config.leagueKey,
      regions: config.regions,
      markets: config.markets,
    },
    {
      priority: 1,
      removeOnComplete: 100,
      removeOnFail: 100,
    },
  );

  return job;
}
