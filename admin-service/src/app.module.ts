import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchesModule } from './matches/matches.module';
import { RabbitMQListenerService } from './rabbitmq/rabbitmq-listener.service';
import { RabbitMQListenerController } from './rabbitmq/rabbitmq-listener.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
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
  }), MatchesModule],
  controllers: [AppController, RabbitMQListenerController],
  providers: [AppService, ],
})
export class AppModule {}