import { upsertEvent } from "../db/repositories/event.repo.js";
import { insertOddsDeltas } from "../db/repositories/odds.repo.js";
import { upsertSportFromEvent } from "../db/repositories/sport.repo.js";
import type { OddsDelta } from "../types/internal.types.js";
import type { OddsApiEvent } from "../types/odds-api.types.js";

export async function persistEventOdds(event: OddsApiEvent, deltas: OddsDelta[]): Promise<void> {
await upsertSportFromEvent(event);
await upsertEvent(event);
await insertOddsDeltas(deltas);
}