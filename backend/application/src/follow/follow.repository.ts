import { DeleteResult, InsertResult, Repository } from "typeorm";
import { Follow } from "./follow.entity";
import { User } from "src/user/user.entity";


export interface FollowRepository extends Repository<Follow> {
	createFollow(follow: { following: User, followed: User }): Promise<InsertResult>;
	//TODO: User 대신 필요한 정보들만 전달하는 DTO로 구현해서 활용하고, 적절한 위치에 위치시켜 이를 활용하는 대상이 접근할 수 있게 하기
	getFollowList(id: number): Promise<Follow[]>;
	//updateFollow //TODO: 필요하면 구현하기
	deleteFollow(id: number): Promise<DeleteResult>;
}

export const customFollowRepository: Pick<FollowRepository, "createFollow" | "getFollowList" | "deleteFollow"> = {
	async createFollow(this: Repository<Follow>, follow): Promise<InsertResult> {
		return await this.insert(this.create(follow));
	},
	//TODO: subquery로 UI에 표현해야 할 사용자 정보들도 select하고 이에 대한 DTO를 정의해 getRawMany()로 반환하기
	async getFollowList(this: Repository<Follow>, id): Promise<Follow[]> {
		return await this.createQueryBuilder("follow").where("follow.following_account_id = :id", { id }).getMany();
	},

	async deleteFollow(this: Repository<Follow>, id): Promise<DeleteResult> {
		return this.delete(id);
	},
}