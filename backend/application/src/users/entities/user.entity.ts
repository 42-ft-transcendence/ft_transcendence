import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LadderEnum } from "./ladder.enum";
import { Friendship } from "./friendship.entity";
import { Match } from "./match.entity";
import { Blocked } from "src/chat/entities/blocked.entity";
import { Channel } from "src/chat/entities/channel.entity"
import { Administrator } from "src/chat/entities/administrator.entity";
import { Banned } from "src/chat/entities/banned.entity";
import { Participant } from "src/chat/entities/participant.entity";
import { Message } from "src/chat/entities/message.entity";

@Entity({ name: "account" })
export class User {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@Column({ type: "text", unique: true, nullable: false }) //TODO: 사용자가 이미지를 지정하지 않을 때 기본 이미지 경로를 42 인트라 프로필 이미지로 하지 않고,  공통 이미지를 적용하려면 unique 옵션 제거하기
	avatar!: string;

	@Column({ type: "varchar", length: 10, unique: true, nullable: false })
	nickname!: string;

	@Column({ type: "int", default: 0, nullable: false })
	win_count!: number;

	@Column({ type: "int", default: 0, nullable: false })
	lose_count!: number;

	@Column({ type: "enum", enum: LadderEnum, default: LadderEnum.BRONZE, nullable: false })
	ladder!: LadderEnum;

	@CreateDateColumn({ type: "timestamp", nullable: false })
	created_at!: Date;

	@UpdateDateColumn({ type: "timestamp", nullable: false })
	updated_at!: Date;

	// friendship relation
	@OneToMany(() => Friendship, (friendship) => friendship.first_user)
	first_user!: Friendship[];

	@OneToMany(() => Friendship, (friendship) => friendship.second_user)
	second_user!: Friendship[];

	// match relation
	@OneToMany(() => Match, (match) => match.user)
	user_match!: Match[];

	@OneToMany(() => Match, (match) => match.opponent)
	opponent!: Match[];

	// blocked relation
	@OneToMany(() => Blocked, (blocked) => blocked.user)
	user_blocked!: Blocked[];

	@OneToMany(() => Blocked, (blocked) => blocked.target)
	target!: Blocked[];

	// channel relation
	@OneToMany(() => Channel, (channel) => channel.owner)
	owner!: Channel[]

	// administrator relation
	@OneToMany(() => Administrator, (administrator) => administrator.user)
	user_administrator!: Administrator[];

	// banned relation
	@OneToMany(() => Banned, (banned) => banned.user)
	user_banned!: Banned[];

	// participant relation
	@OneToMany(() => Participant, (participant) => participant.user)
	user_participant!: Participant[];

	// message relation
	@OneToMany(() => Message, (message) => message.sender)
	sender!: Message[];
}