import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { Tracking } from './tracking.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports:[SequelizeModule.forFeature([Tracking])],
  providers: [TrackingService],
  exports:[TrackingService]
})

export class TrackingModule {}
