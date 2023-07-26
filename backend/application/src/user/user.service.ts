import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
//TODO: check return types of functions related to userRepository.
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: UserRepository,
	) { }

	async createUser(user: { avatarPath: string; nickname: string; }): Promise<InsertResult> {
		return await this.userRepository.createUser(user);
	}

	async getUser(id: number): Promise<User> {
		return await this.userRepository.getUser(id);
	}

	async updateUser(id: number, user: { avatarPath: string; nickname: string }): Promise<UpdateResult> {
		return await this.userRepository.updateUser(id, user);
	}

	async deleteUser(id: number): Promise<DeleteResult> {
		return await this.userRepository.deleteUser(id);
	}
}
