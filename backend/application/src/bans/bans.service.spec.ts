import { Test, TestingModule } from '@nestjs/testing';
import { BansService } from './bans.service';

describe('BansService', () => {
  let service: BansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansService],
    }).compile();

    service = module.get<BansService>(BansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
