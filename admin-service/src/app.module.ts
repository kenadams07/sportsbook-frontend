import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { SportsModule } from './sports/sports.module';
import { EventsModule } from './events/events.module';
import { MarketsModule } from './markets/markets.module';
import { RunnersModule } from './runners/runners.module';
import { SportStakeSettingsModule } from './sportStakeSettings/sportStakeSettings.module';
import { CurrencyModule } from './currency/currency.module';
import { WhiteLabelModule } from './whiteLabel/whiteLabel.module';
import { ExposureModule } from './exposure/exposure.module';
import { ResultTransactionModule } from './resultTransaction/resultTransaction.module';
import { SportBetsModule } from './sportBets/sportBets.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { QueueTestModule } from './test/testMsgQueue/QueueTest.module';
import { RabbitMQListenerService } from './rabbitmq/rabbitmq-listener.service';
import { RabbitMQListenerController } from './rabbitmq/rabbitmq-listener.controller';
import { RedisModule } from './config/redis.module';
import { LeaguesModule } from './leagues/leagues.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', '1478'),
        database: configService.get('DB_NAME', 'sportsbook'),
        autoLoadEntities: configService.get<boolean>('DB_AUTO_LOAD_ENTITIES', true),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    SportsModule,
    EventsModule,
    MarketsModule,
    RunnersModule,
    SportStakeSettingsModule,
    CurrencyModule,
    WhiteLabelModule,
    ExposureModule,
    ResultTransactionModule,
    SportBetsModule,
    UsersModule,
    EmailModule,
    QueueTestModule,
    LeaguesModule,
  ],
  controllers: [AppController, RabbitMQListenerController],
  providers: [AppService, AppGateway, RabbitMQListenerService],
})
export class AppModule { }