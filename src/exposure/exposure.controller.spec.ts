import { Test, TestingModule } from '@nestjs/testing';
import { ExposureController } from './exposure.controller';
import { ExposureService } from './exposure.service';
import { Exposure } from './exposure.entity';

describe('ExposureController', () => {
  let controller: ExposureController;
  let service: ExposureService;

  const mockExposureService = {
    findAll: jest.fn(),
    create: jest.fn(),
    upsertExposure: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExposureController],
      providers: [
        {
          provide: ExposureService,
          useValue: mockExposureService,
        },
      ],
    }).compile();

    controller = module.get<ExposureController>(ExposureController);
    service = module.get<ExposureService>(ExposureService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of exposures', async () => {
      const result: Exposure[] = [];
      mockExposureService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new exposure', async () => {
      const exposureDto: Partial<Exposure> = {
        exposure: 100.50,
        marketType: 'ODDS',
        is_clear: 'false',
      };

      const result: Exposure = {
        id: '1',
        ...exposureDto,
      } as any;

      mockExposureService.create.mockResolvedValue(result);

      expect(await controller.create(exposureDto)).toBe(result);
    });
  });

  describe('updateExposure', () => {
    it('should update exposure data with eventId', async () => {
      const payload = {
        marketId: 'market1',
        eventId: 'event1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      const result: Exposure = {
        id: '1',
        ...payload,
      } as any;

      mockExposureService.upsertExposure.mockResolvedValue(result);

      expect(await controller.updateExposure(payload)).toBe(result);
    });

    it('should update exposure data without eventId', async () => {
      const payload = {
        marketId: 'market1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      };

      const result: Exposure = {
        id: '1',
        marketId: 'market1',
        userId: 'user1',
        is_clear: 'false',
        marketType: 'ODDS',
        exposure: 100.50,
      } as any;

      mockExposureService.upsertExposure.mockResolvedValue(result);

      expect(await controller.updateExposure(payload)).toBe(result);
    });
  });
});