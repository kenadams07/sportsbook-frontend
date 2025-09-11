import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExposureService } from './exposure.service';
import { ExposureController } from './exposure.controller';
import { Exposure } from './exposure.entity';
import { Users } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exposure, Users])],
  providers: [ExposureService],
  controllers: [ExposureController],
  exports: [ExposureService],
})
export class ExposureModule {}