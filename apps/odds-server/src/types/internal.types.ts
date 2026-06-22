export type Movement = "up" | "down" | "new";

export type RawOddsDelta = {
    sportKey:string;
    eventId:string;
    eventName:string;
    eventType:"MATCH" | "OUTRIGHT";
    homeTeam:string | null;
    awayTeam:string | null;
    commenceTime:string;
    bookmaker:string;
    market:string;
    outcome:string;
    price:number;
    prevPrice:number | null;
    point:number | null;
    moved :Movement;
}

export type OddsDelta = RawOddsDelta & {
  impliedProb: number;
  overround: number;
  ts: number;
};
