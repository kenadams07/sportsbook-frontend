import { Prisma, prisma } from "@sportbooks/db";

import type { PlaceBetInput } from "./bet.schemas.js";
import { calculateExposure } from "./exposure.engine.js";
import { toBetResponse } from "./bet.presenter.js";

function badRequest(message: string) {
  return Object.assign(new Error(message), { statusCode: 400 });
}

function normalisePlaceBetInput(input: PlaceBetInput) {
  const selection = input.outcome ?? input.runnername;
  const selectionId = input.selectionId ?? input.runnerid ?? selection;
  const odds = input.price ?? input.odds;
  const marketId =
    input.marketId ??
    input.market ??
    (input.marketType === "MATCH_ODDS" || input.marketName === "MATCH ODDS"
      ? "matchOdds-0"
      : undefined);

  if (!selection) {
    throw badRequest("outcome or runnername is required");
  }

  if (!marketId) {
    throw badRequest("marketId is required");
  }

  if (!selectionId) {
    throw badRequest("selectionId or runnerid is required");
  }

  return {
    marketId,
    selection,
    selectionId,
    odds,
  };
}

export async function placeBet(input: PlaceBetInput) {
  const normalised = normalisePlaceBetInput(input);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: input.userId },
      include: { currency: true },
    });

    if (!user) {
      throw badRequest("User not found");
    }

    if (!user.betAllow) {
      throw badRequest("Betting is disabled for this user");
    }

    const event = await tx.event.findUnique({
      where: { id: input.eventId },
    });

    if (!event) {
      throw badRequest("Event not found");
    }

    const leagueKey = input.sportKey ?? input.sportsid ?? event.leagueKey;

    const market = await tx.market.upsert({
      where: {
        marketId_eventId: {
          marketId: normalised.marketId,
          eventId: input.eventId,
        },
      },
      update: {
        marketName: input.marketName,
        marketType: "ODDS",
        marketTime: new Date(),
      },
      create: {
        marketId: normalised.marketId,
        eventId: input.eventId,
        marketName: input.marketName,
        marketType: "ODDS",
        marketTime: new Date(),
      },
    });

    const outcome = await tx.outcome.upsert({
      where: {
        marketId_selectionId: {
          marketId: market.id,
          selectionId: normalised.selectionId,
        },
      },
      update: {
        name: normalised.selection,
      },
      create: {
        marketId: market.id,
        selectionId: normalised.selectionId,
        name: normalised.selection,
      },
    });

    const existingBets = await tx.bet.findMany({
      where: {
        userId: input.userId,
        eventId: input.eventId,
        marketId: normalised.marketId,
        status: "PENDING",
      },
    });

    const formattedExisting = existingBets.map((bet) => ({
      type: bet.selectionType,
      outcome: bet.selection,
      odds: Number(bet.odds),
      stake: Number(bet.stake),
    }));

    const oldExposure = calculateExposure(
      formattedExisting,
      input.runners,
    ).exposure;

    const newBetFormatted = {
      type: "BACK",
      outcome: normalised.selection,
      odds: normalised.odds,
      stake: input.stake,
    };

    const newExposure = calculateExposure(
      [...formattedExisting, newBetFormatted],
      input.runners,
    ).exposure;

    const extraNeeded = newExposure - oldExposure;
    const availableBalance = Number(user.balance) - Number(user.exposure);

    if (extraNeeded > 0 && extraNeeded > availableBalance) {
      throw badRequest("Insufficient balance to place this bet");
    }

    if (newExposure > Number(user.balance)) {
      throw badRequest("Exposure cannot exceed user balance");
    }

    const sportTitle = input.sportTitle ?? input.competitionName;

    const betCreateData: Prisma.BetUncheckedCreateInput = {
        userId: input.userId,
        eventId: input.eventId,
        leagueKey,
        marketDbId: market.id,
        marketId: normalised.marketId,
        marketName: input.marketName,
        marketType: input.marketType,
        outcomeDbId: outcome.id,
        selectionId: normalised.selectionId,
        selection: normalised.selection,
        selectionType: "BACK",
        odds: new Prisma.Decimal(normalised.odds),
        stake: new Prisma.Decimal(input.stake),
        bettingType: "ODDS",
        status: "PENDING",
        homeTeam: input.homeTeam ?? event.homeTeam,
        awayTeam: input.awayTeam ?? event.awayTeam,
        commenceTime: input.commenceTime ?? event.commenceTime,
        eventStatusAtPlacement: input.eventStatusAtPlacement ?? event.status,
        potentialPayout: new Prisma.Decimal(
          Number((input.stake * normalised.odds).toFixed(2)),
        ),
        ...(sportTitle ? { sportTitle } : {}),
        ...(input.competitionId !== undefined ? { leagueId: input.competitionId } : {}),
    };

    const bet = await tx.bet.create({
      data: betCreateData,
    });

    await tx.exposure.upsert({
      where: {
        userId_eventId_marketId: {
          userId: input.userId,
          eventId: input.eventId,
          marketId: normalised.marketId,
        },
      },
      update: {
        marketDbId: market.id,
        marketType: input.marketType,
        exposure: new Prisma.Decimal(newExposure),
        isClear: false,
      },
      create: {
        userId: input.userId,
        eventId: input.eventId,
        marketDbId: market.id,
        marketId: normalised.marketId,
        marketType: input.marketType,
        exposure: new Prisma.Decimal(newExposure),
        isClear: false,
      },
    });

    const activeExposures = await tx.exposure.findMany({
      where: {
        userId: input.userId,
        isClear: false,
      },
    });

    const totalExposure = activeExposures.reduce(
      (total, exposure) => total + Number(exposure.exposure),
      0,
    );

    if (totalExposure > Number(user.balance)) {
      throw badRequest("Total exposure cannot exceed user balance");
    }

    await tx.user.update({
      where: { id: input.userId },
      data: {
        exposure: new Prisma.Decimal(totalExposure),
      },
    });

    return {
      success: true,
      bet: toBetResponse(bet),
      account: {
        userId: input.userId,
        balance: Number(user.balance),
        exposure: Number(totalExposure.toFixed(2)),
        availableBalance: Number((Number(user.balance) - totalExposure).toFixed(2)),
      },
    };
  });
}

export async function getUserBets(userId: string, eventId?: string) {
  const bets = await prisma.bet.findMany({
    where: {
      userId,
      ...(eventId ? { eventId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return bets.map(toBetResponse);
}

export async function getUserBetGroups(userId: string) {
  const bets = await prisma.bet.findMany({
    where: { userId },
    select: {
      eventId: true,
      leagueKey: true,
      marketId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const seen = new Set<string>();
  const result: { eventId: string; sportId: string; marketId: string }[] = [];

  for (const bet of bets) {
    const key = `${bet.eventId}-${bet.leagueKey}-${bet.marketId}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push({
      eventId: bet.eventId,
      sportId: bet.leagueKey,
      marketId: bet.marketId,
    });
  }

  return result;
}

export async function settleMarketResults(
  marketId: string,
  winningSelection: string,
) {
  return prisma.$transaction(async (tx) => {
    const openBets = await tx.bet.findMany({
      where: {
        marketId,
        status: "PENDING",
      },
      include: {
        user: true,
      },
    });

    if (openBets.length === 0) {
      return {
        success: true,
        message: "No open bets found for this market",
        processedBets: 0,
        results: [],
      };
    }

    const results = [];

    for (const bet of openBets) {
      const isWinner =
        bet.selection.toLowerCase() === winningSelection.toLowerCase();
      const profitLoss = isWinner
        ? (Number(bet.odds) - 1) * Number(bet.stake)
        : -Number(bet.stake);
      const newStatus = isWinner ? "WON" : "LOST";

      const user = await tx.user.findUnique({
        where: { id: bet.userId },
      });

      if (!user) {
        throw badRequest(`User ${bet.userId} not found`);
      }

      const newBalance = Number(user.balance) + profitLoss;

      if (newBalance < 0) {
        throw badRequest(
          `User ${bet.userId} balance would go negative after settlement`,
        );
      }

      await tx.user.update({
        where: { id: bet.userId },
        data: {
          balance: new Prisma.Decimal(newBalance),
        },
      });

      await tx.bet.update({
        where: { id: bet.id },
        data: {
          status: newStatus,
        },
      });

      await tx.resultTransaction.create({
        data: {
          userId: bet.userId,
          marketDbId: bet.marketDbId,
          marketId: bet.marketId,
          eventId: bet.eventId,
          description: `Bet settlement for market ${marketId}, selection: ${bet.selection}, status: ${newStatus}`,
          pl: new Prisma.Decimal(profitLoss),
          type: "sportbet",
          commissionStatus: "ONE",
        },
      });

      await tx.exposure.updateMany({
        where: {
          userId: bet.userId,
          marketId: bet.marketId,
          eventId: bet.eventId,
          isClear: false,
        },
        data: {
          isClear: true,
        },
      });

      const activeExposures = await tx.exposure.findMany({
        where: {
          userId: bet.userId,
          isClear: false,
        },
      });

      const totalExposure = activeExposures.reduce(
        (total, exposure) => total + Number(exposure.exposure),
        0,
      );

      await tx.user.update({
        where: { id: bet.userId },
        data: {
          exposure: new Prisma.Decimal(totalExposure),
        },
      });

      results.push({
        betId: bet.id,
        userId: bet.userId,
        originalStake: Number(bet.stake),
        odds: Number(bet.odds),
        selection: bet.selection,
        winningSelection,
        profitLoss: Number(profitLoss.toFixed(2)),
        newStatus,
        newBalance: Number(newBalance.toFixed(2)),
        newExposure: Number(totalExposure.toFixed(2)),
      });
    }

    return {
      success: true,
      message: `Successfully settled ${results.length} bets for market ${marketId}`,
      processedBets: results.length,
      results,
    };
  });
}

export async function getMarketReport(
  userId: string,
  marketId?: string,
  eventId?: string,
) {
  const resultTransactions = await prisma.resultTransaction.findMany({
    where: {
      userId,
      ...(marketId ? { marketId } : {}),
      ...(eventId ? { eventId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw badRequest("User not found");
  }

  let runningBalance = Number(user.balance);

  return resultTransactions.map((transaction) => {
    const pl = Number(transaction.pl);
    const entry = {
      id: transaction.id,
      userId: transaction.userId,
      marketId: transaction.marketId,
      eventId: transaction.eventId,
      description: transaction.description,
      type: transaction.type,
      commissionStatus: transaction.commissionStatus,
      creditAmount: pl > 0 ? pl : 0,
      debitAmount: pl < 0 ? Math.abs(pl) : 0,
      pl,
      runningBalance,
      timestamp: transaction.createdAt,
    };

    runningBalance -= pl;
    return entry;
  });
}
