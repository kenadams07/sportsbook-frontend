import { prisma } from "../client.js";

async function normalizeMarketsForLeague(leagueKey: string, markets?: string[]) {
  if (!markets) {
    return markets;
  }

  const league = await prisma.league.findUnique({
    where: {
      key: leagueKey,
    },
    select: {
      hasOutrights: true,
    },
  });

  if (league?.hasOutrights && !markets.includes("outrights")) {
    return ["outrights"];
  }

  return markets;
}

export async function findEnabledSportConfigs() {
  return prisma.leagueConfig.findMany({
    where: {
      enabled: true,
    },
    orderBy: {
      leagueKey: "asc",
    },
  });
}

export async function findAllSportConfigs() {
  return prisma.leagueConfig.findMany({
    include: {
      league: true,
    },
    orderBy: {
      leagueKey: "asc",
    },
  });
}

export async function findSportConfigByKey(sportKey: string) {
  return prisma.leagueConfig.findUnique({
    where: {
      leagueKey: sportKey,
    },
  });
}

export async function upsertSportConfig(input: {
  sportKey: string;
  regions: string[];
  markets: string[];
  enabled?: boolean;
  pollIntervalMs?: number | null;
}) {
  await prisma.league.upsert({
    where: {
      key: input.sportKey,
    },
    create: {
      key: input.sportKey,
      sportName: input.sportKey,
      title: input.sportKey,
      description: null,
      active: true,
      hasOutrights: false,
    },
    update: {},
  });

  const markets = (await normalizeMarketsForLeague(input.sportKey, input.markets)) ?? input.markets;

  return prisma.leagueConfig.upsert({
    where: {
      leagueKey: input.sportKey,
    },
    create: {
      leagueKey: input.sportKey,
      regions: input.regions,
      markets,
      enabled: input.enabled ?? true,
      pollIntervalMs: input.pollIntervalMs ?? null,
    },
    update: {
      regions: input.regions,
      markets,
      enabled: input.enabled ?? true,
      pollIntervalMs: input.pollIntervalMs ?? null,
    },
    include: {
      league: true,
    },
  });
}

export async function updateSportConfig(
  sportKey: string,
  input: {
    regions?: string[];
    markets?: string[];
    enabled?: boolean;
    pollIntervalMs?: number | null;
  },
) {
  const markets = await normalizeMarketsForLeague(sportKey, input.markets);
  const { markets: _inputMarkets, ...rest } = input;

  return prisma.leagueConfig.update({
    where: {
      leagueKey: sportKey,
    },
    data: {
      ...rest,
      ...(markets ? { markets } : {}),
    },
    include: {
      league: true,
    },
  });
}

export async function deleteSportConfig(sportKey: string) {
  return prisma.leagueConfig.delete({
    where: {
      leagueKey: sportKey,
    },
  });
}

