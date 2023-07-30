import { Controller } from '@nestjs/common';
import { ParticipantService } from './participant.service';

@Controller('participant')
export class ParticipantController {
	constructor(private participantService: ParticipantService) { }
}
