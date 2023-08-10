import { PartialType } from '@nestjs/swagger';
import { CreateParticipantDto } from '.';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}
