import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from 'src/common';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  imports: [PrismaModule],
})
export class ParticipantsModule {}
