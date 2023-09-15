import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UsersModule } from 'src/users/users.module';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaModule } from 'src/common';

@Module({
  providers: [EventsGateway, MessagesService],
  imports: [UsersModule, PrismaModule]
})
export class EventsModule {}
