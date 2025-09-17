import { Injectable } from '@nestjs/common';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {
  private matches: Match[] = [];

  getAllMatches(): Match[] {
    return this.matches;
  }

  createMatch(match: Match): Match {
    match.id = (this.matches.length + 1).toString();
    this.matches.push(match);
    return match;
  }
}
