import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RunnersService } from './runners.service';
import { Runners } from './runners.entity';

const mockRunner = {
  id: '1',
  name: 'Test Runner',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('RunnersService', () => {
  let service: RunnersService;
  let repository: Repository<Runners>;

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockRunner]),
    findOne: jest.fn().mockResolvedValue(mockRunner),
    create: jest.fn().mockReturnValue(mockRunner),
    save: jest.fn().mockResolvedValue(mockRunner),
    update: jest.fn().mockResolvedValue(mockRunner),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunnersService,
        {
          provide: getRepositoryToken(Runners),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RunnersService>(RunnersService);
    repository = module.get<Repository<Runners>>(getRepositoryToken(Runners));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of runners', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockRunner]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single runner', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockRunner);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('create', () => {
    it('should create and return a runner', async () => {
      const runnerData = { name: 'Test Runner' };
      const result = await service.create(runnerData);
      expect(result).toEqual(mockRunner);
      expect(repository.create).toHaveBeenCalledWith(runnerData);
      expect(repository.save).toHaveBeenCalledWith(mockRunner);
    });
  });

  describe('update', () => {
    it('should update and return a runner', async () => {
      const runnerData = { name: 'Updated Runner' };
      const result = await service.update('1', runnerData);
      expect(result).toEqual(mockRunner);
      expect(repository.update).toHaveBeenCalledWith('1', runnerData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('remove', () => {
    it('should remove a runner', async () => {
      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });
});