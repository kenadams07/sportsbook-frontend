export type OddsApiSport = {
    key:string;
    group:string;
    title:string;
    description:string;
    active:boolean;
    has_outrights:boolean;
}

export type OddsApiOutcome = {
    name:string;
    price:number;
    point?:number | null;
}

export type OddsApiMarket = {
    key:string;
    last_update:string;
    outcomes:OddsApiOutcome[];
}

export type OddsApiBookmaker = {
    key:string;
    title:string;
    last_update:string;
    markets:OddsApiMarket[];
}

export type OddsApiEvent = {
    id:string;
    sport_key:string;
    sport_title:string;
    commence_time:string;
    home_team:string | null;
    away_team:string | null;
    bookmakers:OddsApiBookmaker[];
}

export type OddsApiEventSummary = {
    id:string;
    sport_key:string;
    sport_title:string;
    commence_time:string;
    home_team:string | null;
    away_team:string | null;
}

export type OddsApiScore = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }> | null;
  last_update: string | null;
};
