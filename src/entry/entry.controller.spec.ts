import { Test, TestingModule } from '@nestjs/testing';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { TrackingService } from '../tracking/tracking.service';
import { AppService } from '../app.service';
import { IEntry } from '../interfaces/IEntry';
import { IResponse } from '../interfaces/IResponse';
import { Entry } from './entry.model';
import { getModelToken } from '@nestjs/sequelize';

describe('EntryController', () => {
  let controller: EntryController;
  let entryService: EntryService;
  let trackingService: TrackingService;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntryController],
      providers: [
        {
          provide: EntryService,
          useValue: {
            createOrUpdateEntry: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: TrackingService,
          useValue: {
            createTracking: jest.fn(),
          },
        },
        {
          provide: AppService,
          useValue: {
            setUrl: jest.fn(),
            getEntries: jest.fn(),
          },
        },
        {
          provide: getModelToken(Entry),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EntryController>(EntryController);
    entryService = module.get<EntryService>(EntryService);
    trackingService = module.get<TrackingService>(TrackingService);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateOrCreateEntries', () => {
    it('should update or create entries and return success response', async () => {
      const entries: IEntry[] = [
        { position: 1, title: 'Test', points: 100, num_comments: 50 }
      ];
      const createdEntries = [
        { id: 1, position: 1, title: 'Test', points: 100, num_comments: 50, createdAt: Date.now(), updatedAt: Date.now() }
      ];

      jest.spyOn(appService, 'getEntries').mockResolvedValue(entries);
      jest.spyOn(entryService, 'createOrUpdateEntry').mockResolvedValue(createdEntries[0] as any);
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await controller.updateOrCreateEntries();
      expect(response.status).toBe('success');
      expect(response.data).toEqual(createdEntries);
      expect(appService.getEntries).toHaveBeenCalled();
      expect(entryService.createOrUpdateEntry).toHaveBeenCalledTimes(entries.length);
      expect(trackingService.createTracking).toHaveBeenCalled();
    });

    it('should return error response if an error occurs', async () => {
      const errorMessage = 'An error occurred';
      jest.spyOn(appService, 'getEntries').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await controller.updateOrCreateEntries();
      expect(response.status).toBe('error');
      expect(response.message).toBe('An error occured when updating or creating entries.');
      expect(response.data).toBe(errorMessage);
      expect(appService.getEntries).toHaveBeenCalled();
      expect(trackingService.createTracking).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all entries ordered by updatedAt in descending order', async () => {
      const entries = [
        { id: 1, updatedAt: Date.now() }
      ];

      jest.spyOn(entryService, 'findAll').mockResolvedValue(entries as any);
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await controller.findAll();
      expect(response.status).toBe('success');
      expect(response.data).toEqual(entries);
      expect(entryService.findAll).toHaveBeenCalledWith('DESC');
      expect(trackingService.createTracking).toHaveBeenCalled();
    });

    it('should return error response if an error occurs', async () => {
      const errorMessage = 'An error occurred';
      jest.spyOn(entryService, 'findAll').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await controller.findAll();
      expect(response.status).toBe('error');
      expect(response.message).toBe('An error occured while finding entries.');
      expect(response.data).toBe(errorMessage);
      expect(entryService.findAll).toHaveBeenCalledWith('DESC');
      expect(trackingService.createTracking).toHaveBeenCalled();
    });
  });

  describe('filterLessThan', () => {
    // it('should return filtered entries by title length less than or equal to the specified number', async () => {
    //   const num = 3;
      
    //   const entries = [
    //     { id: 1, title: 'A - good test', points: 100, num_comments: 50, updatedAt: Date.now() },
    //     { id: 2, title: 'Another', points: 200, num_comments: 75, updatedAt: Date.now() }
    //   ];

    //   const filteredEntries = entries.filter(entry => controller.cleanText(entry.title)?.trim().split(' ').length <= num);

    //   jest.spyOn(entryService, 'findAll').mockResolvedValue(entries as any);
    //   jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

    //   const response = await controller.filterLessThan(num);
    //   expect(response.status).toBe('success');
    //   expect(response.data).toEqual(filteredEntries);
    //   expect(entryService.findAll).toHaveBeenCalledWith('DESC');
    //   expect(trackingService.createTracking).toHaveBeenCalled();
    // });

    it('should return error response if an error occurs', async () => {
      const num = 3;
      const errorMessage = 'An error occurred';
      jest.spyOn(entryService, 'findAll').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await controller.filterLessThan(num);
      expect(response.status).toBe('error');
      expect(response.message).toBe('An error occured while filtering.');
      expect(response.data).toBe(errorMessage);
      expect(entryService.findAll).toHaveBeenCalledWith('DESC');
      expect(trackingService.createTracking).toHaveBeenCalled();
    });
  });

  describe('filterMoreThan', () => {
    // it('should return filtered entries by title length greater than the specified number', async () => {
    //   const num = 2;

    //   const entries = [
    //     { id: 1, title: 'Test me -', num_comments: 50, updatedAt: Date.now() },
    //     { id: 2, title: 'Another test to try', num_comments: 75, updatedAt: Date.now() }
    //   ];

    //   const filteredEntries = entries.filter(entry => controller.cleanText(entry.title)?.trim().split(' ').length > num);
      
    //   jest.spyOn(entryService, 'findAll').mockResolvedValue(entries as any);
    //   jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);
      
    //   const response = await controller.filterMoreThan(num);
    //   expect(response.status).toBe('success');
    //   expect(response.data).toEqual(filteredEntries);
    //   expect(entryService.findAll).toHaveBeenCalledWith('DESC');
    //   expect(trackingService.createTracking).toHaveBeenCalled();
    // });

    it('should return error response if an error occurs', async () => {
      const num = 1;
      const errorMessage = 'An error occurred';
      jest.spyOn(entryService, 'findAll').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(trackingService, 'createTracking').mockResolvedValue(undefined);

      const response = await controller.filterMoreThan(num);
      expect(response.status).toBe('error');
      expect(response.message).toBe('An error occured while filtering.');
      expect(response.data).toBe(errorMessage);
      expect(entryService.findAll).toHaveBeenCalledWith('DESC');
      expect(trackingService.createTracking).toHaveBeenCalled();
    });
  });
});
