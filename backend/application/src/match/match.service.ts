import { Injectable } from '@nestjs/common';
import { MatchRepository } from './match.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchService {
	constructor(
		@InjectRepository(Match)
		private matchRepository: MatchRepository
	) { }

	getMatches(id: number): Promise<Match[]> {
		return this.matchRepository.getMatchList(id);
	}
}
