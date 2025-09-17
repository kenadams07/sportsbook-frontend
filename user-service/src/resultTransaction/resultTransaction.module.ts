import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultTransationService } from './resultTransaction.service';
import { ResultTransactionController } from './resultTransaction.controller';
import { ResultTransaction } from './resultTransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResultTransaction])],
  providers: [ResultTransationService],
  controllers: [ResultTransactionController],
})
export class ResultTransactionModule {}
