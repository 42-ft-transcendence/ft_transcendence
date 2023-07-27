import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
	constructor(
		@InjectRepository(Follow)
		private customFollowRepository: FollowRepository
	) { }
}
