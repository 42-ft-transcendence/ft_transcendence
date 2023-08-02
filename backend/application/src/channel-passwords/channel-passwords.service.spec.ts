import { Test, TestingModule } from '@nestjs/testing';
import { ChannelPasswordsService } from './channel-passwords.service';

describe('ChannelPasswordsService', () => {
  let service: ChannelPasswordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelPasswordsService],
    }).compile();

    service = module.get<ChannelPasswordsService>(ChannelPasswordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
