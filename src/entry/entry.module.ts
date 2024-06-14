import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { Entry } from './entry.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TrackingService } from 'src/tracking/tracking.service';
import { AppService } from 'src/app.service';
import { Tracking } from 'src/tracking/tracking.model';

@Module({
  imports:[SequelizeModule.forFeature([Entry, Tracking])],
  controllers: [EntryController],
  providers: [EntryService, TrackingService, AppService]
})

export class EntryModule {}
