import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IEntry } from './interfaces/IEntry';
import { TrackingService } from './tracking/tracking.service';
import { IResponse } from './interfaces/IResponse';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trackingService: TrackingService
  ) {}

  @Get('/')
  async welcome(): Promise<string>{

    return "Welcome to the web crawler";
  }

  /**
   * Gets the entries from the url
   * @returns Returns a response containing the scraped data if succesful, error and error message otherwise
   */
  @Get('/scrap')
  async getScrapingData(): Promise<IResponse>{
    let response: IResponse;

    try{
      this.appService.setUrl('https://news.ycombinator.com/');
  
      const res = await this.appService.getEntries();
  
      response = {
        status: 'success',
        message :'Web page successfully scraped for entries.',
        data: res
      }
    }catch(error){
      response = {
        status: 'success',
        message: 'An error occured while scraping.',
        data: error.message
      }
    }
    
    await this.trackingService.createTracking(Date.now(), `/scrap`, response.status, response.message);

    return response;
  }
}
