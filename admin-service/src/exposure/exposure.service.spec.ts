import { Test, TestingModule } from '@nestjs/testing';
import { ExposureService } from './exposure.service';

describe('ExposureService', () => {
  let service: ExposureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExposureService],
    }).compile();

    service = module.get<ExposureService>(ExposureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});