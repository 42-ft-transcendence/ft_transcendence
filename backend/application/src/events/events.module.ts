import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/common';
import { UsersService } from 'src/users/users.service';

@Module({
	providers: [EventsGateway, MessagesService, PrismaService, UsersService],
})
export class EventsModule {}
