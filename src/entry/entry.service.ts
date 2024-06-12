import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Entry } from './entry.model';

@Injectable()
export class EntryService {
    constructor(
        @InjectModel(Entry)
        private entryModel: typeof Entry
    ){}

    async createEntry(position: Number, title: string, points: Number, num_comments: Number): Promise<Entry> {
        return this.entryModel.create({ position, title, points, num_comments });
    }
    
    async findAll(): Promise<Entry[]> {
        return this.entryModel.findAll();
    }
}
