import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/common';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PongService } from './pong/pong.service';

@Module({
	providers: [
		EventsGateway,
		MessagesService,
		PrismaService,
		UsersService,
		PongService,
	],
	imports: [JwtModule],
})
export class EventsModule {}
