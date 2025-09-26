import { Module  } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
import { EmailModule } from './email/email.module';
import { RabbitMQTriggerService } from './rabbitmq/rabbitmq-trigger.service';
import * as redisStore from 'cache-manager-redis-store';
import { QueueModule } from './test/testMsgQueue/QueueTest.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', '1478'),
        database: configService.get<string>('DB_NAME', 'sportsbook'),
        autoLoadEntities: configService.get<boolean>('DB_AUTO_LOAD_ENTITIES', true),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      }),
      inject: [ConfigService],
    }),
      CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        if (redisHost) {
          return {
            store: redisStore,
            host: redisHost,
            port: configService.get<number>('REDIS_PORT', 6379),
          };
        }
        return {
          store: 'memory',
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    WhiteLabelModule,
    CurrencyModule,
    SportsModule,
    EventsModule,
    MarketModule,
    RunnersModule,
    SportBetsModule,
    ExposureModule,
    ResultTransactionModule,
    SportStakeSettingsModule,
    EmailModule,
    QueueModule,

  ],
  providers: [AppGateway, RabbitMQTriggerService],
  exports: [],
})
export class AppModule { }