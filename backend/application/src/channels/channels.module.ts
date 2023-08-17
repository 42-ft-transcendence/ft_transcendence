import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { PrismaModule } from 'src/common';

@Module({
	controllers: [ChannelsController],
	providers: [ChannelsService],
	imports: [PrismaModule],
})
export class ChannelsModule { }
