import { Controller, Get, Post, Body } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from './match.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  findAll(): Match[] {
    return this.matchesService.getAllMatches();
  }

  @Post()
  create(@Body() match: Match): Match {
    return this.matchesService.createMatch(match);
  }
}
