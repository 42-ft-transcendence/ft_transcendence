import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { LadderEnum } from "./ladder.enum"
import { User } from "./user.entity";

@Entity()
export class Match {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.user_match, { nullable: false })
	@JoinColumn({ name: "user_id" })
	user!: User;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.opponent, { nullable: false })
	@JoinColumn({ name: "opponent_id" })
	opponent!: User;

	@Column({ type: "enum", enum: LadderEnum, nullable: false })
	user_ladder_then!: LadderEnum;

	@Column({ type: "enum", enum: LadderEnum, nullable: false })
	opponent_ladder_then!: LadderEnum;

	@Column({ type: "boolean", default: false, nullable: false })
	win_or_not!: boolean;

	@Column({ type: "timestamp", nullable: false })
	match_at!: Date;
}