import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
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
  ],
})
export class AppModule {}
