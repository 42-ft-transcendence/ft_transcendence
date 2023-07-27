import { DeleteResult, InsertResult, Repository } from "typeorm";
import { Match } from "./match.entity";
import { User } from "../user/user.entity";

export interface MatchRepository extends Repository<Match> {
	this: Repository<Match>;
	createMatch(match: { winner: User; loser: User; matchAt: Date }): Promise<InsertResult>;
	getMatchesOfUser(user_id: number): Promise<Match[]>;
	// updateMatch //TODO: 로직 상 Match 정보를 변경할 일이 있다면 구현하기
	deleteMatch(id: number): Promise<DeleteResult>;
}

export const customMatchRepository: Pick<MatchRepository, "createMatch" | "getMatchesOfUser" | "deleteMatch"> = {
	async createMatch(this: Repository<Match>, match): Promise<InsertResult> {
		const { winner, loser, matchAt } = match;

		return await this.insert(
			this.create({
				winner: winner,
				loser: loser,
				winnerLadderthen: winner.ladder,
				loserLadderthen: loser.ladder,
				matchAt: matchAt
			})
		);
	},

	async getMatchesOfUser(this: Repository<Match>, userId): Promise<Match[]> {
		return await this
			.createQueryBuilder("match")
			.where("match.win_account_id = :winnerId", { winnerId: userId })
			.orWhere("match.lose_account_id = :loserId", { loserId: userId })
			.getMany();
	},
	//TODO: 데이터베이스 트리거로 winner, loser 모두 탈퇴했을 때 지우도록 구현하기
	async deleteMatch(this: Repository<Match>, id): Promise<DeleteResult> {
		return await this.delete(id);
	}
}