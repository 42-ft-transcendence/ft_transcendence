import { Module } from '@nestjs/common';
import { ChannelPasswordController } from './channel-password.controller';
import { ChannelPasswordService } from './channel-password.service';

@Module({
  controllers: [ChannelPasswordController],
  providers: [ChannelPasswordService]
})
export class ChannelPasswordModule {}
