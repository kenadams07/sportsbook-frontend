import type { OddsApiEvent, OddsApiSport } from "../../types/odds-api.types.js";
import { prisma } from "../client.js";

function toCategoryKey(group: string) {
  return group
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getCategoryKey(group: string) {
  return toCategoryKey(group || "other") || "other";
}

export async function upsertSportCategoryFromGroup(group: string) {
  const name = group?.trim() || "Other";

  return prisma.sport.upsert({
    where: {
      key: getCategoryKey(name),
    },
    create: {
      key: getCategoryKey(name),
      name,
      active: true,
    },
    update: {
      name,
      active: true,
    },
  });
}

export async function upsertSportFromEvent(event: OddsApiEvent): Promise<void> {
  const existingLeague = await prisma.league.findUnique({
    where: {
      key: event.sport_key,
    },
    select: {
      key: true,
    },
  });

  if (existingLeague) {
    await prisma.league.update({
      where: {
        key: event.sport_key,
      },
      data: {
        title: event.sport_title,
        updatedAt: new Date(),
      },
    });
    return;
  }

  await upsertSportCategoryFromGroup(event.sport_title);

  await prisma.league.create({
    data: {
      key: event.sport_key,
      title: event.sport_title,
      sportName: event.sport_title,
      description: null,
      active: true,
      hasOutrights: !event.home_team || !event.away_team,
      sportKey: getCategoryKey(event.sport_title),
    },
  });
}

export async function upsertSportFromApiSport(sport: OddsApiSport) {
  await upsertSportCategoryFromGroup(sport.group);

  return prisma.league.upsert({
    where: {
      key: sport.key,
    },
    create: {
      key: sport.key,
      sportName: sport.group,
      title: sport.title,
      description: sport.description || null,
      active: sport.active,
      hasOutrights: sport.has_outrights,
      sportKey: getCategoryKey(sport.group),
    },
    update: {
      sportName: sport.group,
      title: sport.title,
      description: sport.description || null,
      active: sport.active,
      hasOutrights: sport.has_outrights,
      sportKey: getCategoryKey(sport.group),
    },
  });
}

export async function findAllSportCategories() {
  return prisma.sport.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findAllSportsWithConfig() {
  return prisma.league.findMany({
    include: {
      config: true,
      sport: true,
    },
    orderBy: [{ sportName: "asc" }, { title: "asc" }],
  });
}
export async function findConfiguredLeaguesByCategoryKey(categoryKey: string) {
  return prisma.league.findMany({
    where: {
      sportKey: categoryKey,
      active: true,
      config: {
        enabled: true,
      },
    },
    include: {
      config: true,
      sport: true,
    },
    orderBy: {
      title: "asc",
    },
  });
}


