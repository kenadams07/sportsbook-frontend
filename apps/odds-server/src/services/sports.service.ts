import { Prisma } from "@prisma/client";

import {
  deleteSportConfig,
  findAllSportConfigs,
  updateSportConfig,
  upsertSportConfig,
} from "../db/repositories/sport-config.repo.js";
import {
  addSportPollJob,
  getScheduleIntervalMs,
  removeSportPollJob,
} from "../ingestion/scheduler.service.js";

export type CreateSportConfigInput = {
  key: string;
  regions: string[];
  markets: string[];
  pollIntervalMs?: number | null;
};

export type UpdateSportConfigInput = {
  regions?: string[];
  markets?: string[];
  enabled?: boolean;
  pollIntervalMs?: number | null;
};

export async function listSportConfigs() {
  return findAllSportConfigs();
}

export async function createSportConfig(input: CreateSportConfigInput) {
  const config = await upsertSportConfig({
    sportKey: input.key,
    regions: input.regions,
    markets: input.markets,
    enabled: true,
    pollIntervalMs: input.pollIntervalMs ?? null,
  });

  await addSportPollJob({
    sportKey: config.leagueKey,
    regions: config.regions,
    markets: config.markets,
    intervalMs: getScheduleIntervalMs(config),
  });

  return config;
}

export async function patchSportConfig(
  sportKey: string,
  input: UpdateSportConfigInput,
) {
  try {
    const config = await updateSportConfig(sportKey, input);

    if (config.enabled) {
      await addSportPollJob({
        sportKey: config.leagueKey,
        regions: config.regions,
        markets: config.markets,
        intervalMs: getScheduleIntervalMs(config),
      });
    } else {
      await removeSportPollJob(config.leagueKey);
    }

    return config;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }

    throw error;
  }
}

export async function removeSportConfig(sportKey: string) {
  try {
    await deleteSportConfig(sportKey);
    await removeSportPollJob(sportKey);
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return false;
    }

    throw error;
  }
}
