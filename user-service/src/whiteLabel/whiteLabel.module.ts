import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteLabelService } from './whiteLabel.service';
import { WhiteLabelController } from './whiteLabel.controller';
import { WhiteLabel } from './whiteLabel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhiteLabel])],
  providers: [WhiteLabelService],
  controllers: [WhiteLabelController],
})
export class WhiteLabelModule {}
