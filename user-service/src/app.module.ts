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
import { RabbitMQListenerService } from './rabbitmq/rabbitmq-listener.service';
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
      CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
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
    SportStakeSettingsModule,
    EmailModule,
    QueueModule,

  ],
  providers: [AppGateway, RabbitMQTriggerService],
  exports: [],
})
export class AppModule { }