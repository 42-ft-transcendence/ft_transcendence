import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from 'src/common';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [PrismaModule],
})
export class MessagesModule {}
