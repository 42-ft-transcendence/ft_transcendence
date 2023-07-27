import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { LadderEnum } from "../common/enum/ladder.enum"
import { User } from "../user/user.entity";

@Entity()
export class Match {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user: User) => user.winnerMatch, {
		onDelete: "SET NULL", // TODO: check - user나 opponent 중 하나라도 탈퇴하지 않은 경우에는 match history를 확인할 수 있어야 하기 때문에 SET NULL로 설정하고 둘 다 탈퇴해서 두 컬럼 모두의 값이 NULL일 때, 데이터베이스 트리거를 사용해서 해당 행을 제거하기. 이를 위해 nullable로 설정.
	})
	@JoinColumn({ name: "win_account_id" })
	winner!: User;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.loserMatch, {
		onDelete: "SET NULL", // TODO: check - user나 opponent 중 하나라도 탈퇴하지 않은 경우에는 match history를 확인할 수 있어야 하기 때문에 SET NULL로 설정하고 둘 다 탈퇴해서 두 컬럼 모두의 값이 NULL일 때, 데이터베이스 트리거를 사용해서 해당 행을 제거하기. 이를 위해 nullable로 설정.
	})
	@JoinColumn({ name: "lose_account_id" })
	loser!: User;

	@Column({ type: "enum", enum: LadderEnum, default: LadderEnum.BRONZE, nullable: false, name: "winner_ladder_then" })
	winnerLadderthen!: LadderEnum;

	@Column({ type: "enum", enum: LadderEnum, default: LadderEnum.BRONZE, nullable: false, name: "loser_ladder_then" })
	loserLadderthen!: LadderEnum;

	@Column({ type: "timestamp", nullable: false, name: "match_at" }) //TODO: timestamp에 대한 정렬은 int에 대한 정렬보다 성능이 떨어지는데, 이 컬럼이 그 외의 필요가 있을지 고민해보고, 없다면 제거하기
	matchAt!: Date;

	// 테이블을 JOIN하지 않고 외래키 컬럼 값을 사용하기 위한 컬럼. TypeORM 기능 상 데이터베이스 테이블에 들어갈 컬럼명과 엔티티의 속성명을 따로 지정하는 옵션이 없기 때문에 name으로 지정한 snake case를 예외적으로 적용. PostgreSQL은 모든 identifier를 소문자로 다루기 떄문이다.
	@Column({ nullable: true })
	win_account_id: number;

	@Column({ nullable: true })
	lose_account_id: number;
}