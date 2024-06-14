import { Test, TestingModule } from '@nestjs/testing';
import { EntryService } from './entry.service';
import { Entry } from './entry.model';
import { getModelToken } from '@nestjs/sequelize';


describe('EntryService', () => {
  let service: EntryService;
  let entryModel: typeof Entry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryService,{
          provide: getModelToken(Entry),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn()
          },
        },
      ],
    }).compile();

    service = module.get<EntryService>(EntryService);
    entryModel = module.get<typeof Entry>(getModelToken(Entry));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateEntry', () => {
    it('should create a new entry', async () => {
      const newEntry = { id: 1, position: 1, title: 'Test', points: 100, num_comments: 50, createdAt: Date.now(), updatedAt: Date.now() };
      jest.spyOn(entryModel, 'create').mockResolvedValue(newEntry as any);

      const result = await service.createOrUpdateEntry(1, 'Test', 100, 50, Date.now());
      expect(result).toEqual(newEntry);
      expect(entryModel.create).toHaveBeenCalled();
    });

    it('should update an existing entry', async () => {
      const existingEntry = { id: 1, position: 1, title: 'Test', points: 50, num_comments: 30, createdAt: Date.now(), updatedAt: Date.now(), save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(entryModel, 'create').mockImplementation(() => { throw { name: 'SequelizeUniqueConstraintError' }; });
      jest.spyOn(entryModel, 'findOne').mockResolvedValue(existingEntry as any);

      const result = await service.createOrUpdateEntry(1, 'Test', 100, 50, Date.now());
      expect(result.position).toBe(1);
      expect(result.points).toBe(100);
      expect(result.num_comments).toBe(50);
      expect(entryModel.findOne).toHaveBeenCalled();
      expect(existingEntry.save).toHaveBeenCalled();
    });

    it('should throw an error if an unexpected error occurs', async () => {
      jest.spyOn(entryModel, 'create').mockImplementation(() => { throw new Error('Unexpected error'); });

      await expect(service.createOrUpdateEntry(1, 'Test', 100, 50, Date.now())).rejects.toThrow('Unexpected error');
    });
  });

  describe('findAll', () => {
    it('should find all entries ordered by updatedAt', async () => {
      const entries = [{ id: 1, updatedAt: Date.now() }];
      jest.spyOn(entryModel, 'findAll').mockResolvedValue(entries as any);

      const result = await service.findAll('DESC');
      expect(result).toEqual(entries);
      expect(entryModel.findAll).toHaveBeenCalledWith({
        order: [['updatedAt', 'DESC']],
      });
    });

    it('should throw an error if an unexpected error occurs', async () => {
      jest.spyOn(entryModel, 'findAll').mockImplementation(() => { throw new Error('Unexpected error'); });

      await expect(service.findAll('DESC')).rejects.toThrow('Unexpected error');
    });
  });

});
