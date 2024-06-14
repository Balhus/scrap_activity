import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EntryService } from './entry.service';
import { Entry } from './entry.model';
import { TrackingService } from '../tracking/tracking.service';
import { AppService } from '../app.service';
import { IEntry } from '../interfaces/IEntry';
import { IResponse } from '../interfaces/IResponse';

@Controller('entry')
export class EntryController {
    constructor(
        private readonly entryService: EntryService, 
        private readonly trackingService: TrackingService, 
        private readonly appService: AppService,
    ) {}

    /**
     * Handles the scraping of data from a specified URL and updates or creates entries in the database.
     * @returns a reponse indicating the success or failure of the operation and the scraped entries
     */
    @Post('/scrap/update')
    async updateOrCreateEntries(): Promise<IResponse>{
        this.appService.setUrl('https://news.ycombinator.com/'); //In an improved version should come from parameters
        let response: IResponse;

        try{
            const res: IEntry[] = await this.appService.getEntries();
            const entriesResult = await Promise.all(res.map((entry) => this.entryService.createOrUpdateEntry(entry.position, entry.title, entry.points, entry.num_comments, Date.now())));
            
            response = {
                status: 'success',
                message: 'Entries have been successfully updated or created.',
                data: entriesResult
            }
        }catch(error){
            response = {
                status: 'error',
                message: 'An error occured when updating or creating entries.',
                data: error.message
            }
            
        }

        await this.trackingService.createTracking(Date.now(), '/entry/scrap/update', response.status, response.message);

        return response;
    }

    /**
     * Retrieves all entries from the database, ordered in descending order.
     * @returns a reponse indicating the success or failure of the operation
     */
    @Get('/findAll')
    async findAll(): Promise<IResponse> {
        let response: IResponse;

        try{
            const result = await this.entryService.findAll('DESC');
            response = {
                status: 'success',
                message: 'Entries have been successfully updated or created.',
                data: result
            }
        }catch(error){
            response = {
                status: 'error',
                message: 'An error occured while finding entries.',
                data: error.message
            }
        }

        await this.trackingService.createTracking(Date.now(), `/entry/findAll`, response.status, response.message);

        return response;
    }

    /**
     * Filters the entries to those with less than or equal to 5 words ordered by points DESC
     * An improvement would be for this function to be able to sort by any type of field not just comments and to be able to specify the ordering fiedl and direction aswell
     * @returns Entry[] filtered by title length less than or equal to :num and ordered DESC
     */
    @Get('/filter/less/:num/points')
    async filterLessThan(@Param('num') num: Number): Promise<IResponse> {
        let response: IResponse;

        try{
            const entries = this.entryService.findAll('DESC');

            const result = (await entries).filter((entry) => (
                this.processTitle(entry) <= num.valueOf()
            )).sort((a,b) => b?.points?.valueOf() - a?.points?.valueOf());

            response = {
                status: 'success',
                message: 'Filter succesfully applied.',
                data: result
            }
        }catch(error){
            response = {
                status: 'error',
                message: 'An error occured while filtering.',
                data: error.message
            }
        }

        await this.trackingService.createTracking(Date.now(), `/filter/less/${num}/points`, response.status, response.message);

        return response;
    }

    /**
     * Filters the entries to those with more than 5 words ordered by comments DESC
     * An improvement would be for this function to be able to sort by any type of field not just comments and to be able to specify the ordering fiedl and direction aswell
     * @returns Entry[] filtered by title length greater than :num and ordered DESC
     */
    @Get('/filter/more/:num/comments')
    async filterMoreThan(@Param('num') num: Number): Promise<IResponse> {
        let response: IResponse;

        try{
            const entries = this.entryService.findAll('DESC');

            const result = (await entries).filter((entry) => (
                this.processTitle(entry) > num.valueOf()
            )).sort((a,b) => b?.num_comments?.valueOf() - a?.num_comments?.valueOf());

            response = {
                status: 'success',
                message: 'Filter succesfully applied.',
                data: result
            }
        }catch(error){
            response = {
                status: 'error',
                message: 'An error occured while filtering.',
                data: error.message
            }
        }
        
        await this.trackingService.createTracking(Date.now(), `/filter/less/${num}/comments`, response.status, response.message);

        return response;
    }

    /**
     * Cleans the text to remove alone special characters
     * @param text Text to be cleanes
     * @returns the text cleaned or null
     */
    cleanText(text: string | undefined): string | null{
        if(text){
            //Replace all special characters and underscores from the beginning of the string
            // let cleanedText = text.replaceAll(/^\W+|^\_/g, " ");
        
            //Replace special characters and underscores at the end of the string
            // cleanedText = cleanedText.replace(/\W+$|\_$/g, "");
            
            //Replace special characters in the beginning of each word or if they are alone
            let cleanedText = text.replace(/(?:\s)[_\W]+|\_(?=\s)/g, " ");
            
            return cleanedText;
        }

        return null;
    }


    processTitle(entry: Entry): number{
        return this.cleanText(Object.assign({},entry)?.dataValues?.title)?.trim().split(' ').length;
    }
}
