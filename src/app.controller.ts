import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IEntry } from './interfaces/IEntry';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/scrap')
  async getScrappingData(): Promise<IEntry[]>{

    this.appService.setUrl('https://news.ycombinator.com/');

    const res = await this.appService.getEntries();
    
    return res;
  }
}
