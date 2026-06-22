import type { Prisma } from "@sportbooks/db";

type BetRecord = Prisma.BetGetPayload<Record<string, never>>;

export function toBetResponse(bet: BetRecord) {
  return {
    id: bet.id,
    userId: bet.userId,
    eventId: bet.eventId,
    sportKey: bet.leagueKey,
    sportTitle: bet.sportTitle,
    stake: Number(bet.stake),
    selectionType: bet.selectionType.toLowerCase(),
    odds: Number(bet.odds),
    marketId: bet.marketId,
    selection: bet.selection,
    marketType: bet.marketType,
    leagueId: bet.leagueId,
    selectionId: bet.selectionId,
    marketName: bet.marketName,
    bettingType: bet.bettingType,
    status: bet.status,
    homeTeam: bet.homeTeam,
    awayTeam: bet.awayTeam,
    commenceTime: bet.commenceTime,
    eventStatusAtPlacement: bet.eventStatusAtPlacement,
    potentialPayout: bet.potentialPayout ? Number(bet.potentialPayout) : null,
    createdAt: bet.createdAt,
    updatedAt: bet.updatedAt,
  };
}
