import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Entry } from './entry.model';


@Injectable()
export class EntryService {
    constructor(
        @InjectModel(Entry)
        private entryModel: typeof Entry
    ){}

    /**
     * Tries to create an Entry, if an Entry with the same title exists, updates that entry instead
     * @returns The created or updated entry
     */
    async createOrUpdateEntry(position: Number, title: string, points: Number, num_comments: Number, date: Number): Promise<Entry> {
        try {
          // Try to create a new Entry
          const entry = await this.entryModel.create({ position, title, points, num_comments, createdAt: date, updatedAt: date });
          return entry;
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            // If it already exists, update the fields we need
            const existingEntry = await this.entryModel.findOne({ where: { title } });

            if (existingEntry) {
              existingEntry.position = position;
              existingEntry.points = points;
              existingEntry.num_comments = num_comments;
              existingEntry.updatedAt = date;

              await existingEntry.save();
              return existingEntry;
            }
          } else {
            throw error;
          }
        }
    }
    
    async findAll(direction: string): Promise<Entry[]> {
        return this.entryModel.findAll({
            order: [
                ['updatedAt', direction]
            ]
        });
    }
}
