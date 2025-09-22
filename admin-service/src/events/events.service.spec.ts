import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { of } from 'rxjs';
import { EventsService } from './events.service';
import { Events } from './events.entity';

describe('EventsService', () => {
  let service: EventsService;
  let httpService: HttpService;
  let eventsRepository: Repository<Events>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Events),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    httpService = module.get<HttpService>(HttpService);
    eventsRepository = module.get<Repository<Events>>(getRepositoryToken(Events));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLiveEvents', () => {
    it('should fetch live events from external API', async () => {
      const sportId = 'sr:sport:21';
      const mockResponse = {
        data: {
          events: [
            {
              sport_name: 'Football',
              competition_id: 'comp1',
              competition_name: 'Premier League',
              event_id: 'event1',
              event_name: 'Match 1',
              open_date: '2023-01-01',
              event_date: '2023-01-01',
              event_time: '15:00',
              home_team: 'Home Team',
              away_team: 'Away Team',
            },
          ],
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse) as any);

      const result = await service.getLiveEvents(sportId);
      
      expect(httpService.get).toHaveBeenCalledWith(
        'http://89.116.20.218:2700/events',
        {
          params: {
            live_matches: 'true',
            sport_id: sportId,
          },
        }
      );
      
      expect(result).toHaveProperty('sports');
      expect(result.sports).toHaveLength(1);
    });
  });
});