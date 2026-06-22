import { prisma } from "../client.js";

const MARKET_ID_BY_KEY: Record<string, string> = {
  h2h: "matchOdds-0",
  spreads: "spreads-0",
  totals: "totals-0",
  outrights: "outrights-0",
};

const MARKET_NAME_BY_KEY: Record<string, string> = {
  h2h: "Match Odds",
  spreads: "Spreads",
  totals: "Totals",
  outrights: "Outrights",
};

function toMarketId(marketKey: string) {
  return MARKET_ID_BY_KEY[marketKey] ?? `${marketKey}-0`;
}

function toMarketName(marketKey: string) {
  return MARKET_NAME_BY_KEY[marketKey] ?? marketKey;
}

function isSoccerSport(sportKey: string, sportGroup?: string | null) {
  return sportKey.startsWith("soccer_") || sportGroup?.toLowerCase() === "soccer";
}

function buildOutcomeNames(input: {
  marketKey: string;
  sportKey: string;
  sportGroup?: string | null;
  homeTeam?: string | null;
  awayTeam?: string | null;
}) {
  if (input.marketKey === "totals") {
    return ["Over", "Under"];
  }

  if (!input.homeTeam || !input.awayTeam) {
    return [];
  }

  if (input.marketKey === "outrights") {
    return [input.homeTeam, input.awayTeam];
  }

  if (input.marketKey === "h2h" && isSoccerSport(input.sportKey, input.sportGroup)) {
    return [input.homeTeam, "Draw", input.awayTeam];
  }

  return [input.homeTeam, input.awayTeam];
}

function toSelectionId(marketId: string, outcomeName: string, index: number) {
  if (marketId === "matchOdds-0") {
    return outcomeName;
  }

  return `${marketId}-${index}`;
}

export async function restoreMarketsForEvents(input: {
  eventIds: string[];
  marketKey: string;
}) {
  const uniqueEventIds = [...new Set(input.eventIds)].filter(Boolean);

  if (uniqueEventIds.length === 0) {
    return {
      eventCount: 0,
      marketCount: 0,
      outcomeCount: 0,
    };
  }

  const marketId = toMarketId(input.marketKey);
  const marketName = toMarketName(input.marketKey);

  return prisma.$transaction(async (tx) => {
    const events = await tx.event.findMany({
      where: {
        id: {
          in: uniqueEventIds,
        },
      },
      include: {
        league: true,
      },
    });

    if (events.length === 0) {
      return {
        eventCount: 0,
        marketCount: 0,
        outcomeCount: 0,
      };
    }

    const marketData = events.map((event) => ({
      eventId: event.id,
      marketId,
      marketName,
      marketType: "ODDS" as const,
      marketTime: event.commenceTime,
    }));

    const marketsResult = await tx.market.createMany({
      data: marketData,
      skipDuplicates: true,
    });

    const markets = await tx.market.findMany({
      where: {
        eventId: {
          in: events.map((event) => event.id),
        },
        marketId,
      },
      select: {
        id: true,
        eventId: true,
      },
    });

    const marketByEventId = new Map(markets.map((market) => [market.eventId, market]));
    const outcomeData = events.flatMap((event) => {
      const market = marketByEventId.get(event.id);

      if (!market) {
        return [];
      }

      return buildOutcomeNames({
        marketKey: input.marketKey,
        sportKey: event.leagueKey,
        sportGroup: event.league.sportName,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
      }).map((name, index) => ({
        marketId: market.id,
        selectionId: toSelectionId(marketId, name, index),
        name,
      }));
    });

    const outcomesResult = outcomeData.length
      ? await tx.outcome.createMany({
          data: outcomeData,
          skipDuplicates: true,
        })
      : { count: 0 };

    const restoredMarkets = await tx.market.findMany({
      where: {
        eventId: {
          in: events.map((event) => event.id),
        },
        marketId,
      },
      select: {
        id: true,
      },
    });

    const restoredMarketIds = restoredMarkets.map((market) => market.id);
    const restoredOutcomeCount = restoredMarketIds.length
      ? await tx.outcome.count({
          where: {
            marketId: {
              in: restoredMarketIds,
            },
          },
        })
      : 0;

    return {
      eventCount: events.length,
      marketCount: restoredMarkets.length,
      outcomeCount: restoredOutcomeCount,
      createdMarketCount: marketsResult.count,
      createdOutcomeCount: outcomesResult.count,
    };
  });
}
