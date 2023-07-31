import { Controller } from '@nestjs/common';
import { ChannelPasswordService } from './channel-password.service';

@Controller('channel-password')
export class ChannelPasswordController {
  constructor(private channelPasswordService: ChannelPasswordService) {}
}
