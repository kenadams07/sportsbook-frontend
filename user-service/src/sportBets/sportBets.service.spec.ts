import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SportBetsService } from './sportBets.service';
import { SportBets } from './sportBets.entity';
import { Exposure } from '../exposure/exposure.entity';
import { UsersService } from '../users/users.service';
import { AppGateway } from '../app.gateway';

describe('SportBetsService', () => {
  let service: SportBetsService;
  let mockSportBetsRepository: any;
  let mockExposureRepository: any;

  const mockBets = [
    {
      id: '1',
      eventId: 'event1',
      sportId: 'sport1',
      stake: 100,
      selectionType: 'back',
      odds: 1.5,
      marketId: 'market1',
      selection: 'selection1',
      marketType: 'ODDS',
      leagueId: 'league1',
      selectionId: 'selectionId1',
      marketName: 'marketName1',
      bettingType: 'ODDS',
      status: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockSportBetsRepository = {
      find: jest.fn(),
      save: jest.fn(),
    };

    mockExposureRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportBetsService,
        {
          provide: getRepositoryToken(SportBets),
          useValue: mockSportBetsRepository,
        },
        {
          provide: getRepositoryToken(Exposure),
          useValue: mockExposureRepository,
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
            updateUserExposure: jest.fn(),
          },
        },
        {
          provide: AppGateway,
          useValue: {
            emitExposureUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SportBetsService>(SportBetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return bets for a given user ID', async () => {
      const userId = 'user1';
      mockSportBetsRepository.find.mockResolvedValue(mockBets);

      const result = await service.findByUserId(userId);
      expect(result).toEqual(mockBets);
      expect(mockSportBetsRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId }
        },
        order: {
          createdAt: 'DESC'
        }
      });
    });
  });

  describe('findByUserIdAndEventId', () => {
    it('should return bets for a given user ID and event ID', async () => {
      const userId = 'user1';
      const eventId = 'event1';
      mockSportBetsRepository.find.mockResolvedValue(mockBets);

      const result = await service.findByUserIdAndEventId(userId, eventId);
      expect(result).toEqual(mockBets);
      expect(mockSportBetsRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          eventId: eventId
        },
        order: {
          createdAt: 'DESC'
        }
      });
    });
  });
});