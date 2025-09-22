import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markets } from './markets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Markets])],
  exports: [TypeOrmModule],
})
export class MarketsModule {}