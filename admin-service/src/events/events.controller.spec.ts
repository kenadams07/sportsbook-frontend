import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            getLiveEvents: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLiveEvents', () => {
    it('should call service.getLiveEvents with sportId', async () => {
      const sportId = 'sr:sport:21';
      const result = { sports: [] };
      
      jest.spyOn(service, 'getLiveEvents').mockResolvedValue(result);

      expect(await controller.getLiveEvents(sportId)).toBe(result);
      expect(service.getLiveEvents).toHaveBeenCalledWith(sportId);
    });
  });
});