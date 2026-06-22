import { disconnectDb, prisma } from "@sportbooks/db";

const now = Date.now();

const sports = [
  {
    key: "baseball_mlb",
    group: "Baseball",
    title: "MLB",
    teams: [
      ["New York Yankees", "Boston Red Sox"],
      ["Los Angeles Dodgers", "San Francisco Giants"],
    ],
  },
  {
    key: "soccer_brazil_campeonato",
    group: "Soccer",
    title: "Brazil Serie A",
    teams: [
      ["Flamengo", "Palmeiras"],
      ["Santos", "Corinthians"],
    ],
  },
  {
    key: "basketball_wnba",
    group: "Basketball",
    title: "WNBA",
    teams: [
      ["New York Liberty", "Las Vegas Aces"],
      ["Indiana Fever", "Chicago Sky"],
    ],
  },
  {
    key: "cricket_odi",
    group: "Cricket",
    title: "One Day Internationals",
    teams: [
      ["India", "Australia"],
      ["England", "South Africa"],
    ],
  },
  {
    key: "tennis_wta_queens_club_champ",
    group: "Tennis",
    title: "WTA Queen's Club Championships",
    teams: [
      ["Coco Gauff", "Iga Swiatek"],
      ["Aryna Sabalenka", "Elena Rybakina"],
    ],
  },
];

for (const sport of sports) {
  await prisma.sport.upsert({
    where: { key: sport.key },
    update: {
      group: sport.group,
      title: sport.title,
      active: true,
      hasOutrights: false,
    },
    create: {
      key: sport.key,
      group: sport.group,
      title: sport.title,
      active: true,
      hasOutrights: false,
    },
  });

  await prisma.sportConfig.upsert({
    where: { sportKey: sport.key },
    update: {
      regions: ["us"],
      markets: ["h2h"],
      enabled: true,
      pollIntervalMs: 5000,
    },
    create: {
      sportKey: sport.key,
      regions: ["us"],
      markets: ["h2h"],
      enabled: true,
      pollIntervalMs: 5000,
    },
  });

  const liveId = `dev_${sport.key}_live_1`;
  const preMatchId = `dev_${sport.key}_pre_1`;

  await prisma.event.upsert({
    where: { id: liveId },
    update: {
      sportKey: sport.key,
      homeTeam: sport.teams[0][0],
      awayTeam: sport.teams[0][1],
      commenceTime: new Date(now - 5 * 60 * 1000),
      status: "LIVE",
      statusSource: "SYSTEM",
    },
    create: {
      id: liveId,
      sportKey: sport.key,
      homeTeam: sport.teams[0][0],
      awayTeam: sport.teams[0][1],
      commenceTime: new Date(now - 5 * 60 * 1000),
      status: "LIVE",
      statusSource: "SYSTEM",
    },
  });

  await prisma.event.upsert({
    where: { id: preMatchId },
    update: {
      sportKey: sport.key,
      homeTeam: sport.teams[1][0],
      awayTeam: sport.teams[1][1],
      commenceTime: new Date(now + 60 * 60 * 1000),
      status: "PRE_MATCH",
      statusSource: "SYSTEM",
    },
    create: {
      id: preMatchId,
      sportKey: sport.key,
      homeTeam: sport.teams[1][0],
      awayTeam: sport.teams[1][1],
      commenceTime: new Date(now + 60 * 60 * 1000),
      status: "PRE_MATCH",
      statusSource: "SYSTEM",
    },
  });
}

const counts = await prisma.event.groupBy({
  by: ["sportKey", "status"],
  _count: { _all: true },
  where: { id: { startsWith: "dev_" } },
  orderBy: [{ sportKey: "asc" }, { status: "asc" }],
});

console.log(JSON.stringify(counts, null, 2));

await disconnectDb();
