import { z } from "zod";

const optionalString = z
  .preprocess((value) => (value === null ? undefined : value), z.string().min(1).optional());

export const placeBetSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().min(1),
  sportKey: optionalString,
  sportsid: optionalString,
  sportTitle: optionalString,
  competitionName: optionalString,
  stake: z.coerce.number().positive(),
  odds: z.coerce.number().positive(),
  price: z.coerce.number().positive().optional(),
  marketId: optionalString,
  market: optionalString,
  marketType: z.string().default("ODDS"),
  marketName: z.string().default("Unknown Market"),
  runnername: optionalString,
  outcome: optionalString,
  runnerid: optionalString,
  selectionId: optionalString,
  competitionId: optionalString,
  runners: z.array(z.string().min(1)).min(1),
  homeTeam: optionalString,
  awayTeam: optionalString,
  commenceTime: z.coerce.date().optional(),
  eventStatusAtPlacement: z
    .enum(["PRE_MATCH", "LIVE", "SETTLED", "POSTPONED", "CANCELLED"])
    .optional(),
});

export type PlaceBetInput = z.infer<typeof placeBetSchema>;
