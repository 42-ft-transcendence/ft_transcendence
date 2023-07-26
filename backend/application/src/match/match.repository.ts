import { DeleteResult, InsertResult, Repository } from "typeorm";
import { Match } from "./match.entity";
import { User } from "../user/user.entity";

export interface MatchRepository extends Repository<Match> {
	this: Repository<Match>;
	createMatch(match: { user: User; opponent: User; result: boolean, matchAt: Date }): Promise<InsertResult>;
	getMatchesOfUser(user_id: number): Promise<Match[]>;
	// updateMatch //TODO: 로직 상 Match 정보를 변경할 일이 있다면 구현하기
	deleteMatch(id: number): Promise<DeleteResult>;
}

export const customMatchRepository: Pick<MatchRepository, "createMatch" | "getMatchesOfUser" | "deleteMatch"> = {
	async createMatch(this: Repository<Match>, match): Promise<InsertResult> {
		const created = this.create(match);

		return await this.insert(created);
	},

	async getMatchesOfUser(this: Repository<Match>, user_id): Promise<Match[]> {
		return await this.findBy({ user: { id: user_id } });
	},

	async deleteMatch(this: Repository<Match>, id): Promise<DeleteResult> {
		return await this.delete(id);
	}
}