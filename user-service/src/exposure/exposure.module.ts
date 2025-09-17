import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExposureService } from './exposure.service';
import { ExposureController } from './exposure.controller';
import { Exposure } from './exposure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exposure])],
  providers: [ExposureService],
  controllers: [ExposureController],
})
export class ExposureModule {}
