import { DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";
import { User } from "./user.entity";
//TODO: check return types
export interface UserRepository extends Repository<User> {
	this: Repository<User>;
	createUser(user: { avatarPath: string; nickname: string }): Promise<InsertResult>;
	getUser(id: number): Promise<User>;
	// getUserByNickname(nickname: string): Promise<User>;
	updateUser(id: number, user: { avatarPath: string; nickname: string }): Promise<UpdateResult>;
	// updateAvatarByNickname(nickname: string, avatarPath: string);
	deleteUser(id: number): Promise<DeleteResult>; //TODO: transaction
	// deleteUserByNickname(nickname: string); //TODO: transaction
}

export const userCustomRepository: Pick<UserRepository, "createUser" | "getUser" | "updateUser" | "deleteUser"> = {
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

	updateUser(this: Repository<User>, id, { avatarPath, nickname }): Promise<UpdateResult> {
		return this.update({ id: id }, { avatar: avatarPath, nickname: nickname });
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
