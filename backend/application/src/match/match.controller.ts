import { Controller, Get, Param } from '@nestjs/common';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
	constructor(private matchService: MatchService) {}

	@Get(':id')
	getMatches(@Param('id') id: number): Promise<Match[]> {
		return this.matchService.getMatches(id);
	}
}
