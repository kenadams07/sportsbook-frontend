import { Test, TestingModule } from '@nestjs/testing';
import { SportsService } from './sports.service';
import { Sports } from './sports.entity';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SportsService', () => {
  let service: SportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        {
          provide: getRepositoryToken(Sports),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});