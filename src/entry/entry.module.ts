import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { Entry } from './entry.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports:[SequelizeModule.forFeature([Entry])],
  controllers: [EntryController],
  providers: [EntryService]
})

export class EntryModule {}
