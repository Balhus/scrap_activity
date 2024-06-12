import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EntryService } from './entry.service';
import { Entry } from './entry.model';

@Controller('entry')
export class EntryController {
    constructor(private readonly entryService: EntryService) {}

    @Get('/findAll')
    async findAll(): Promise<Entry[]> {
        return this.entryService.findAll();
    }
}
