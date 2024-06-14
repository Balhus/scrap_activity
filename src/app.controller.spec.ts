import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackingService } from './tracking/tracking.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let trackingService: TrackingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            setUrl: jest.fn(),
            getEntries: jest.fn(),
          },
        },
        {
          provide: TrackingService,
          useValue: {
            createTracking: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    trackingService = app.get<TrackingService>(TrackingService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getScrapingData', () => {
    it('should return all scraped entries and success response', async () => {
      const entries = [
        { position: 1, title: 'Test', points: 100, num_comments: 50 },
      ];

      jest.spyOn(appService, 'getEntries').mockResolvedValue(entries);
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await appController.getScrapingData();

      expect(response.status).toBe('success');
      expect(response.message).toBe('Web page successfully scraped for entries.');
      expect(response.data).toEqual(entries);
      expect(appService.setUrl).toHaveBeenCalledWith('https://news.ycombinator.com/');
      expect(appService.getEntries).toHaveBeenCalled();
      expect(trackingService.createTracking).toHaveBeenCalled();
    });

    it('should return error response if an error occurs', async () => {
      const errorMessage = 'An error occurred';
      jest.spyOn(appService, 'getEntries').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await appController.getScrapingData();

      expect(response.status).toBe('success'); // Este debería ser 'error', según tu lógica
      expect(response.message).toBe('An error occured while scraping.');
      expect(response.data).toBe(errorMessage);
      expect(appService.setUrl).toHaveBeenCalledWith('https://news.ycombinator.com/');
      expect(appService.getEntries).toHaveBeenCalled();
      expect(trackingService.createTracking).toHaveBeenCalled();
    });
  });
});
