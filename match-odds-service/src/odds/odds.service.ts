import { Injectable } from '@nestjs/common';

@Injectable()
export class OddsService {
  private odds = [
    { matchId: 1, teamA: 'India', teamB: 'Australia', oddsA: 1.5, oddsB: 2.2 },
    { matchId: 2, teamA: 'England', teamB: 'Pakistan', oddsA: 1.8, oddsB: 1.9 },
  ];

  getOdds() {
    return this.odds;
  }

  updateOdds(matchId: number, newOdds: any) {
    const match = this.odds.find((m) => m.matchId === matchId);
    if (match) {
      Object.assign(match, newOdds);
    }
    return match;
  }
}
