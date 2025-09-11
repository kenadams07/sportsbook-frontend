import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { ExposureService } from '../exposure/exposure.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let exposureService: ExposureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findUserByToken: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Currency),
          useValue: {},
        },
        {
          provide: ExposureService,
          useValue: {
            findAllByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});