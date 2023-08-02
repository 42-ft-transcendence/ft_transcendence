import { Module } from '@nestjs/common';
import { ChannelPasswordsService } from './channel-passwords.service';
import { ChannelPasswordsController } from './channel-passwords.controller';
import { PrismaModule } from 'src/common';

@Module({
  controllers: [ChannelPasswordsController],
  providers: [ChannelPasswordsService],
  imports: [PrismaModule],
})
export class ChannelPasswordsModule {}
