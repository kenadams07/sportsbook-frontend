import type { OddsDelta } from "../../types/internal.types.js";
import { prisma } from "../client.js";

export async function insertOddsDeltas(deltas: OddsDelta[]):Promise<void> {
if(deltas.length === 0) {
    return;
}
await prisma.oddsSnapshot.createMany({
    data:deltas.map((delta) => ({
        leagueKey:delta.sportKey,
        eventId: delta.eventId,
        bookmaker: delta.bookmaker,
        market: delta.market,
        outcome: delta.outcome,
        price: delta.price,
        prevPrice: delta.prevPrice,
        point: delta.point,
        impliedProb: delta.impliedProb,
        overround: delta.overround,
        moved:delta.moved,
        capturedAt: new Date(delta.ts),
    }))
})
}
