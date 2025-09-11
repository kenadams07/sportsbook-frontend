import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ExposureService } from './exposure.service';
import { Exposure } from './exposure.entity';
import { Users } from '../users/users.entity';

describe('ExposureService', () => {
  let service: ExposureService;
  let mockExposureRepository;
  let mockUsersRepository;
  let mockEntityManager;

  beforeEach(async () => {
    // Create mock repositories
    mockExposureRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockUsersRepository = {
      findOne: jest.fn(),
    };

    mockEntityManager = {
      transaction: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExposureService,
        {
          provide: getRepositoryToken(Exposure),
          useValue: mockExposureRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<ExposureService>(ExposureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsertExposure', () => {
    it('should create a new exposure when one does not exist with eventId', async () => {
      const payload = {
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });
      mockEntityManager.findOne.mockResolvedValue(null);
      mockEntityManager.create.mockReturnValue({ id: 'exposure1', ...payload });
      mockEntityManager.save.mockResolvedValue({ id: 'exposure1', ...payload });
      mockEntityManager.transaction = jest.fn((fn) => fn(mockEntityManager));

      const result = await service.upsertExposure(payload);

      expect(result).toEqual({ id: 'exposure1', ...payload });
      expect(mockEntityManager.create).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it('should create a new exposure when one does not exist without eventId', async () => {
      const payload = {
        marketId: 'market1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });
      mockEntityManager.findOne.mockResolvedValue(null);
      mockEntityManager.create.mockReturnValue({ id: 'exposure1', marketId: 'market1', eventId: undefined, user: { id: 'user1' }, is_clear: 'false', marketType: 'ODDS', exposure: 100.50 });
      mockEntityManager.save.mockResolvedValue({ id: 'exposure1', marketId: 'market1', eventId: undefined, user: { id: 'user1' }, is_clear: 'false', marketType: 'ODDS', exposure: 100.50 });
      mockEntityManager.transaction = jest.fn((fn) => fn(mockEntityManager));

      const result = await service.upsertExposure(payload);

      expect(result.marketId).toBe('market1');
      expect(result.user.id).toBe('user1');
      expect(result.is_clear).toBe('false');
      expect(result.marketType).toBe('ODDS');
      expect(result.exposure).toBe(100.50);
      expect(mockEntityManager.create).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it('should update an existing exposure when one exists with matching eventId', async () => {
      const payload = {
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'true',
        marketType: 'ODDS',
        exposure: 200.75,
      };

      const existingExposure = {
        id: 'exposure1',
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });
      mockEntityManager.findOne.mockResolvedValue(existingExposure);
      mockEntityManager.save.mockResolvedValue({ 
        ...existingExposure, 
        is_clear: payload.is_clear,
        marketType: payload.marketType,
        exposure: payload.exposure 
      });
      mockEntityManager.transaction = jest.fn((fn) => fn(mockEntityManager));

      const result = await service.upsertExposure(payload);

      expect(result.exposure).toBe(payload.exposure);
      expect(result.is_clear).toBe(payload.is_clear);
      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it('should create a new exposure when eventId is different', async () => {
      const payload = {
        marketId: 'market1',
        eventId: 'event2', // Different eventId
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      // Existing record has eventId: 'event1'
      const existingExposure = {
        id: 'exposure1',
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });
      // findOne should return null because we're looking for eventId: 'event2'
      mockEntityManager.findOne.mockResolvedValue(null);
      mockEntityManager.create.mockReturnValue({ id: 'exposure2', ...payload });
      mockEntityManager.save.mockResolvedValue({ id: 'exposure2', ...payload });
      mockEntityManager.transaction = jest.fn((fn) => fn(mockEntityManager));

      const result = await service.upsertExposure(payload);

      expect(result.eventId).toBe('event2');
      expect(mockEntityManager.create).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it('should add exposure to existing exposure when is_clear is false', async () => {
      const payload = {
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 50.25,
      };

      const existingExposure = {
        id: 'exposure1',
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      const expectedExposure = 150.75; // 100.50 + 50.25

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });
      mockEntityManager.findOne.mockResolvedValue(existingExposure);
      mockEntityManager.save.mockResolvedValue({ 
        ...existingExposure, 
        is_clear: payload.is_clear,
        marketType: payload.marketType,
        exposure: expectedExposure
      });
      mockEntityManager.transaction = jest.fn((fn) => fn(mockEntityManager));

      const result = await service.upsertExposure(payload);

      expect(result.exposure).toBe(expectedExposure);
      expect(result.is_clear).toBe(payload.is_clear);
      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it('should update existing exposure without changing eventId when not provided', async () => {
      const payload = {
        marketId: 'market1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 50.25,
      };

      const existingExposure = {
        id: 'exposure1',
        marketId: 'market1',
        eventId: null,
        user: { id: 'user1' },
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      const expectedExposure = 150.75; // 100.50 + 50.25

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });
      mockEntityManager.findOne.mockResolvedValue(existingExposure);
      mockEntityManager.save.mockResolvedValue({ 
        ...existingExposure, 
        is_clear: payload.is_clear,
        marketType: payload.marketType,
        exposure: expectedExposure
        // eventId should remain unchanged
      });
      mockEntityManager.transaction = jest.fn((fn) => fn(mockEntityManager));

      const result = await service.upsertExposure(payload);

      expect(result.exposure).toBe(expectedExposure);
      expect(result.eventId).toBeNull(); // Should remain unchanged
      expect(result.is_clear).toBe(payload.is_clear);
      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it('should reject when exposure is not a number', async () => {
      const payload = {
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 'invalid' as any, // Simulate invalid value
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: 'user1' });

      await expect(service.upsertExposure(payload as any)).rejects.toThrow('Exposure must be a number');
    });
  });

  describe('findExposureByUserAndMarket', () => {
    it('should find exposure by userId, marketId, and eventId', async () => {
      const exposure = {
        id: 'exposure1',
        marketId: 'market1',
        eventId: 'event1',
        user: { id: 'user1' },
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      mockExposureRepository.findOne.mockResolvedValue(exposure);

      const result = await service.findExposureByUserAndMarket('user1', 'market1', 'event1');

      expect(result).toEqual(exposure);
      expect(mockExposureRepository.findOne).toHaveBeenCalledWith({
        where: {
          marketId: 'market1',
          user: { id: 'user1' },
          eventId: 'event1'
        },
        relations: ['user']
      });
    });

    it('should find exposure by userId and marketId when eventId is not provided', async () => {
      const exposure = {
        id: 'exposure1',
        marketId: 'market1',
        eventId: null,
        user: { id: 'user1' },
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      mockExposureRepository.findOne.mockResolvedValue(exposure);

      const result = await service.findExposureByUserAndMarket('user1', 'market1');

      expect(result).toEqual(exposure);
      expect(mockExposureRepository.findOne).toHaveBeenCalledWith({
        where: {
          marketId: 'market1',
          user: { id: 'user1' },
          eventId: null
        },
        relations: ['user']
      });
    });
  });
});