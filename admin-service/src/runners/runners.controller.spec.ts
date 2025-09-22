import { Test, TestingModule } from '@nestjs/testing';
import { RunnersController } from './runners.controller';
import { RunnersService } from './runners.service';
import { Runners } from './runners.entity';

const mockRunner = {
  id: '1',
  name: 'Test Runner',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('RunnersController', () => {
  let controller: RunnersController;
  let service: RunnersService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockRunner]),
    findOne: jest.fn().mockResolvedValue(mockRunner),
    create: jest.fn().mockResolvedValue(mockRunner),
    update: jest.fn().mockResolvedValue(mockRunner),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunnersController],
      providers: [
        {
          provide: RunnersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RunnersController>(RunnersController);
    service = module.get<RunnersService>(RunnersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of runners', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockRunner]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single runner', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockRunner);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create and return a runner', async () => {
      const runnerData = { name: 'Test Runner' };
      const result = await controller.create(runnerData);
      expect(result).toEqual(mockRunner);
      expect(service.create).toHaveBeenCalledWith(runnerData);
    });
  });

  describe('update', () => {
    it('should update and return a runner', async () => {
      const runnerData = { name: 'Updated Runner' };
      const result = await controller.update('1', runnerData);
      expect(result).toEqual(mockRunner);
      expect(service.update).toHaveBeenCalledWith('1', runnerData);
    });
  });

  describe('remove', () => {
    it('should remove a runner', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});