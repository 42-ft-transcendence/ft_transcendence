import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { PrismaModule } from 'src/common';
import { ParticipantsService } from 'src/participants/participants.service';

@Module({
	controllers: [ChannelsController],
	providers: [ChannelsService, ParticipantsService],
	imports: [PrismaModule],
})
export class ChannelsModule { }
