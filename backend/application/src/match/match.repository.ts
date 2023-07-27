import { DeleteResult, InsertResult, Repository } from "typeorm";
import { Match } from "./match.entity";
import { User } from "../user/user.entity";
import { MatchTypeEnum } from "src/common/enum/match-type.enum";
import { MapTypeEnum } from "src/common/enum/map-type.enum";

export interface MatchRepository extends Repository<Match> {
	this: Repository<Match>;
	createMatch(match: { winner: User; loser: User; type: MatchTypeEnum, mapType: MapTypeEnum, matchAt: Date }): Promise<InsertResult>;
	getMatchList(userId: number): Promise<Match[]>;
	// updateMatch //TODO: 로직 상 Match 정보를 변경할 일이 있다면 구현하기
	deleteMatch(id: number): Promise<DeleteResult>;
}

export const customMatchRepository: Pick<MatchRepository, "createMatch" | "getMatchList" | "deleteMatch"> = {
	async createMatch(this: Repository<Match>, match): Promise<InsertResult> {
		return await this.insert(this.create(match));
	},
	//TODO: UI에서 표시할 winner, loser에 해당하는 user 정보들을 정한 후, subquery를 이용해서 조회하고, 이에 대한 DTO를 정의해서 반환하기
	async getMatchList(this: Repository<Match>, userId): Promise<Match[]> {
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