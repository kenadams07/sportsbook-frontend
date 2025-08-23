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
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '1478'),
        database: configService.get<string>('DB_NAME', 'sportsbook'),
        autoLoadEntities: configService.get<boolean>('DB_AUTO_LOAD_ENTITIES', true),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      }),
      inject: [ConfigService],
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
  providers: [AppGateway],
})
export class AppModule { }