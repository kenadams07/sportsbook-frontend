import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GapCasinoModule } from './modules/games/gap-casino.module';
import { GapCasinoTransactionModule } from './modules/games/gap-casino-transaction.module';
import { GapCasinoUserTokenModule } from './modules/games/gap-casino-user-token.module';
import { UtilsModule } from './common/utils';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    GapCasinoModule,
    GapCasinoTransactionModule,
    GapCasinoUserTokenModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}