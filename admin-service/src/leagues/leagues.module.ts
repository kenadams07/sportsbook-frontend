import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leagues } from './leagues.entity';
import { LeaguesService } from './leagues.service'
import { LeaguesController } from './leagues.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Leagues])],
  providers: [LeaguesService],
  controllers: [LeaguesController],
  exports: [LeaguesService, TypeOrmModule],
})
export class LeaguesModule {}