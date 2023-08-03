import { Test, TestingModule } from '@nestjs/testing';
import { ChannelPasswordsController } from './channel-passwords.controller';
import { ChannelPasswordsService } from './channel-passwords.service';

describe('ChannelPasswordsController', () => {
  let controller: ChannelPasswordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelPasswordsController],
      providers: [ChannelPasswordsService],
    }).compile();

    controller = module.get<ChannelPasswordsController>(
      ChannelPasswordsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
