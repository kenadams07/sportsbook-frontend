import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelService } from './whiteLabel.service';

describe('WhiteLabelService', () => {
  let service: WhiteLabelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhiteLabelService],
    }).compile();

    service = module.get<WhiteLabelService>(WhiteLabelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});