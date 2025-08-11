import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CurrencyModule } from './currency/currency.module';
import { ExposureModule } from './exposure/exposure.module';
import { EventsModule } from './events/events.module';
import { SportBetsModule } from './sportBets/sportBets.module';
import { ResultTransactionModule } from './resultTransaction/resultTransaction.module';
import { SportsModule } from './sports/sports.module';
import { WhiteLabelModule } from './whiteLabel/whiteLabel.module';
import { RunnersModule } from './runners/runners.module';
import { MarketModule } from './markets/markets.module';
import { SportStakeSettingsModule } from './sportStakeSettings/sportStakeSettings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // your DB username
      password: "1478", // your DB password
      database: 'sportsbook',
      autoLoadEntities: true, // loads all entities automatically
      synchronize: true, // for dev only — auto creates tables
    }),
    UsersModule,
    WhiteLabelModule,
    CurrencyModule,
    SportsModule, // Assuming you have a SportsModule
    EventsModule,
    MarketModule,
    RunnersModule,
    SportBetsModule,
    ExposureModule,
    ResultTransactionModule,
    SportStakeSettingsModule
  ],
})
export class AppModule { }