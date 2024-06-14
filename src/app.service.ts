import { Injectable } from '@nestjs/common';
import {chromium, Browser, Page} from 'playwright';
import { Entry } from './entry/entry.model';
import { IEntry } from './interfaces/IEntry';

@Injectable()
export class AppService {
  //Variables
  private url: string;

  //Functions
  setUrl(url: string){
    this.url = url;
  }

  /**
   * Creates a Page and Browser with the url provided
   * @returns Page and Browser to do the scraping
   */
  async getPageAndBrowser(): Promise<{page: Page, browser: Browser}>{
    const browser: Browser = await chromium.launch({
      headless:true
    });

    const page: Page = await browser.newPage();
    await page.goto(this.url);

    // await page.waitForTimeout(1000) //Delete after test

    return { page, browser };
  }

  /**
   * Scraps for the required data of the entries
   * @returns IEntry interface with all the entries scraped
   */
  async getEntries(): Promise<IEntry[]>{
    //Getting the Page
    const {page, browser}:{page: Page, browser: Browser} = await this.getPageAndBrowser();

    //Scrapping entries from the given page
    const entries: IEntry[] = await page.evaluate(() => {
      //The regEx does replace all characters except letters
      const onlyLetterRegEx = /[^0-9]/g;

      //Get all the tr with athing class, then get the next row, and filter the ones than the second row is null
      const getPairs = (): Element[][] => Array.from(document.querySelectorAll('tr.athing')).map(row => [row, row ? row.nextElementSibling : null]).filter(pair => pair[1] !== null);

      //Get all the a elements within the given element that has the pattern 'item?id={numbers}'
      const getLinks = (row: Element): HTMLAnchorElement[] => Array.from(row.querySelectorAll('a'))
      .filter((link: HTMLAnchorElement) => /item\?id=\d+/.test(link.getAttribute('href')));

      //From those a elements, filter the ones
      const getCommentElement = (links: HTMLAnchorElement[]): string =>
        links
          .map((link: HTMLAnchorElement) => link.textContent.trim())
          .filter((text: string) => text.includes('comment'))[0];

      //Checks if a string can be parsed to a number and returns the number or undefined
      const checkAndParseInt = (num: string | null | undefined): Number | null => {
        if (num) {
          const parsedRank = parseInt(num, 10);
          if (!isNaN(parsedRank)) {
            return parsedRank;
          }
        }
    
        return null;
      }
      
      //get the position parsed to int or null
      const getPosition = (element: Element): Number | null => ( checkAndParseInt(element?.querySelector('.rank')?.textContent?.replace('.','').trim()));

      //Get title from the element
      const getTitle = (element: Element | null): string | null => (element?.querySelector('.titleline a')?.textContent?.trim());
    
      //Get the points parsed to int or null
      const getPoints = (element: Element | null): Number | null => (
        checkAndParseInt(element?.querySelector('.subline .score')?.textContent.replace(onlyLetterRegEx,'')));

      //Callback to get the data wanted from the given rows
      const processData = ([firstRow, secondRow]) : IEntry => ({
        position: getPosition(firstRow) || 0,
        title: getTitle(firstRow) || '',
        points: getPoints(secondRow) || 0, 
        num_comments: parseInt(getCommentElement(getLinks(secondRow))?.replace(onlyLetterRegEx,'')) || 0
      })
      
      return getPairs().map(processData);
    });

    await browser.close();

    return entries;
  }
  
}
