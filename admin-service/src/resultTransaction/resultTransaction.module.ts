import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultTransaction } from './resultTransaction.entity';
import { ResultTransactionController } from './resultTransaction.controller';
import { ResultTransactionService } from './resultTransaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResultTransaction])],
  controllers: [ResultTransactionController],
  providers: [ResultTransactionService],
  exports: [ResultTransactionService],
})
export class ResultTransactionModule {}