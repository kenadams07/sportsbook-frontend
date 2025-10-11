import { Test, TestingModule } from '@nestjs/testing';
import { SportBetsController } from './sportBets.controller';
import { SportBetsService } from './sportBets.service';
import { SportBets } from './sportBets.entity';

describe('SportBetsController', () => {
  let sportBetsController: SportBetsController;
  let sportBetsService: SportBetsService;

  const mockBets: SportBets[] = [
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
    } as SportBets,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportBetsController],
      providers: [
        {
          provide: SportBetsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockBets),
            findByUserId: jest.fn().mockResolvedValue(mockBets),
            findByUserIdAndEventId: jest.fn().mockResolvedValue(mockBets),
            create: jest.fn().mockResolvedValue(mockBets[0]),
            placeBet: jest.fn().mockResolvedValue({ success: true, bet: mockBets[0] }),
          },
        },
      ],
    }).compile();

    sportBetsController = module.get<SportBetsController>(SportBetsController);
    sportBetsService = module.get<SportBetsService>(SportBetsService);
  });

  describe('findUserBets', () => {
    it('should return an array of bets for a user', async () => {
      const userId = 'user1';
      const result = await sportBetsController.findUserBets(userId);
      expect(result).toEqual(mockBets);
      expect(sportBetsService.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return an array of bets for a user and event ID', async () => {
      const userId = 'user1';
      const eventId = 'event1';
      const result = await sportBetsController.findUserBets(userId, eventId);
      expect(result).toEqual(mockBets);
      expect(sportBetsService.findByUserIdAndEventId).toHaveBeenCalledWith(userId, eventId);
    });
  });
});