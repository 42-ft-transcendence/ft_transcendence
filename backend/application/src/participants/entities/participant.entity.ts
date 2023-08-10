import { ApiProperty } from '@nestjs/swagger';
import { Participant } from '@prisma/client';

export class ParticipantEntity implements Participant {
  @ApiProperty()
  id: number;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  userId: number;
}
