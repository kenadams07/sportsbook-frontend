import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportStakeSettingsService } from './sportStakeSettings.service';
import { SportStakeSettingsController } from './sportStakeSettings.controller';
import { SportStakeSettings } from './sportStakeSettings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SportStakeSettings])],
  providers: [SportStakeSettingsService],
  controllers: [SportStakeSettingsController],
})
export class SportStakeSettingsModule {}
