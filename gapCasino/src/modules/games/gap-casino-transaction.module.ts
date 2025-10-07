import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GapCasinoTransaction } from './entities/gap-casino-transaction.entity';
import { GapCasinoTransactionService } from './gap-casino-transaction.service';
import { GapCasinoTransactionController } from './gap-casino-transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GapCasinoTransaction])],
  controllers: [GapCasinoTransactionController],
  providers: [GapCasinoTransactionService],
  exports: [GapCasinoTransactionService],
})
export class GapCasinoTransactionModule {}