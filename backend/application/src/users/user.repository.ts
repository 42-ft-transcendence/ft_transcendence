import { DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";
import { User } from "./entities/user.entity";
//TODO: check return types
export interface UserRepository extends Repository<User> {
	this: Repository<User>;
	createUser(user: { avatar_path: string; nickname: string }): Promise<InsertResult>;
	getUser(id: number): Promise<User>;
	// getUserByNickname(nickname: string): Promise<User>;
	updateUser(id: number, user: { avatar_path: string; nickname: string }): Promise<UpdateResult>;
	// updateAvatarByNickname(nickname: string, avatar_path: string);
	deleteUser(id: number): Promise<DeleteResult>; //TODO: transaction
	// deleteUserByNickname(nickname: string); //TODO: transaction
}

export const userCustomRepository: Pick<UserRepository, "createUser" | "getUser" | "updateUser" | "deleteUser" > = {
	async createUser(this: Repository<User>, user): Promise<InsertResult> {
		const created = this.create(user);

		return await this.insert(created);
	},

	getUser(this: Repository<User>, id): Promise<User> {
		return this.findOneBy({ id: id });
	},

	// getUserByNickname(this: Repository<User>, nickname: string): Promise<User>{
	// 	return this.findOneBy( {nickname: nickname });
	// },

	updateUser(this: Repository<User>, id, { avatar_path, nickname }): Promise<UpdateResult> {
		return this.update({ id: id }, { avatar: avatar_path, nickname: nickname });
	},

	// updateNickname(this: Repository<User>, id: number, nickname: string): Promise<UpdateResult> {
	// 	return this.update({ id: id }, { nickname: nickname });
	// },

	deleteUser(this: Repository<User>, id: number): Promise<DeleteResult> {
		return this.delete({ id: id });
	},

	// deleteUserByNickname(this: Repository<User>, nickname: string){

	// },
}
