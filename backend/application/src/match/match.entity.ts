import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { LadderEnum } from "../common/enum/ladder.enum"
import { User } from "../user/user.entity";

@Entity()
export class Match {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user: User) => user.userMatch, {
		onDelete: "SET NULL", // TODO: check - user나 opponent 중 하나라도 탈퇴하지 않은 경우에는 match history를 확인할 수 있어야 하기 때문에 SET NULL로 설정하고 둘 다 탈퇴해서 두 컬럼 모두의 값이 NULL일 때, 데이터베이스 트리거를 사용해서 해당 행을 제거하기. 이를 위해 nullable로 설정.
	})
	@JoinColumn({ name: "account_id" })
	user!: User;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.opponent, {
		onDelete: "SET NULL", // TODO: check - user나 opponent 중 하나라도 탈퇴하지 않은 경우에는 match history를 확인할 수 있어야 하기 때문에 SET NULL로 설정하고 둘 다 탈퇴해서 두 컬럼 모두의 값이 NULL일 때, 데이터베이스 트리거를 사용해서 해당 행을 제거하기. 이를 위해 nullable로 설정.
	})
	@JoinColumn({ name: "opponent_id" })
	opponent!: User;

	@Column({ type: "enum", enum: LadderEnum, default: LadderEnum.BRONZE, nullable: false, name: "user_ladder_then" })
	userLadderthen!: LadderEnum;

	@Column({ type: "enum", enum: LadderEnum, default: LadderEnum.BRONZE, nullable: false, name: "opponent_ladder_then" })
	opponentLadderthen!: LadderEnum;

	@Column({ type: "boolean", default: false, nullable: false })
	result!: boolean;

	@Column({ type: "timestamp", nullable: false, name: "match_at" }) //TODO: timestamp에 대한 정렬은 int에 대한 정렬보다 성능이 떨어지는데, 이 컬럼이 그 외의 필요가 있을지 고민해보고, 없다면 제거하기
	matchAt!: Date;
}