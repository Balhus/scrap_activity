import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TrackingService } from './tracking.service';
import { Tracking } from './tracking.model';

describe('TrackingService', () => {
  let service: TrackingService;
  let trackingModel: typeof Tracking;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: getModelToken(Tracking),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    trackingModel = module.get<typeof Tracking>(getModelToken(Tracking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTracking', () => {
    it('should create a tracking entry', async () => {
      const trackingData = {
        request_timestamp: Date.now(),
        action: 'test_action',
        request_status: 'success',
        request_message: 'test_message',
      };
      const trackingInstance = {
        id: 1,
        ...trackingData,
      };

      jest.spyOn(trackingModel, 'create').mockResolvedValue(trackingInstance as any);

      const result = await service.createTracking(
        trackingData.request_timestamp,
        trackingData.action,
        trackingData.request_status,
        trackingData.request_message,
      );

      expect(result).toEqual(trackingInstance);
      expect(trackingModel.create).toHaveBeenCalledWith(trackingData);
    });
  });

  describe('findAll', () => {
    it('should return all tracking entries', async () => {
      const trackingEntries = [
        {
          id: 1,
          request_timestamp: Date.now(),
          action: 'test_action',
          request_status: 'success',
          request_message: 'test_message',
        },
      ];

      jest.spyOn(trackingModel, 'findAll').mockResolvedValue(trackingEntries as any);

      const result = await service.findAll();

      expect(result).toEqual(trackingEntries);
      expect(trackingModel.findAll).toHaveBeenCalled();
    });
  });
});
