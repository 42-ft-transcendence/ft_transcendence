import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LadderEnum } from "../common/enum/ladder.enum";
import { Friendship } from "../friendship/friendship.entity";
import { Match } from "../match/match.entity";
import { Blocked } from "src/blocked/blocked.entity";
import { Administrator } from "src/administrator/administrator.entity";
import { Banned } from "src/banned/banned.entity";
import { Participant } from "src/participant/participant.entity";
import { Message } from "src/message/message.entity";
import { Channel } from "src/channel/channel.entity";

@Entity({ name: "account" })
export class User {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@Column({ type: "text", unique: true, nullable: false }) //TODO: 사용자가 이미지를 지정하지 않을 때 기본 이미지 경로를 42 인트라 프로필 이미지로 하지 않고,  공통 이미지를 적용하려면 unique 옵션 제거하기
	avatar!: string;

	@Column({ type: "varchar", length: 10, unique: true, nullable: false })
	nickname!: string;

	@Column({ type: "int", default: 0, nullable: false, name: "win_count" })
	winCount!: number;

	@Column({ type: "int", default: 0, nullable: false, name: "lose_count" })
	loseCount!: number;

	@Column({ type: "enum", enum: LadderEnum, default: LadderEnum.BRONZE, nullable: false })
	ladder!: LadderEnum;

	@CreateDateColumn({ type: "timestamp", nullable: false, name: "created_at" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamp", nullable: false, name: "updated_at" })
	updatedAt!: Date;

	// friendship relation
	@OneToMany(() => Friendship, (friendship: Friendship) => friendship.secondUser)
	firstUser!: Friendship[];

	@OneToMany(() => Friendship, (friendship: Friendship) => friendship.secondUser)
	secondUser!: Friendship[];

	// match relation
	@OneToMany(() => Match, (match: Match) => match.winner)
	winnerMatch!: Match[];

	@OneToMany(() => Match, (match: Match) => match.loser)
	loserMatch!: Match[];

	// blocked relation
	@OneToMany(() => Blocked, (blocked: Blocked) => blocked.user)
	userBlocked!: Blocked[];

	@OneToMany(() => Blocked, (blocked: Blocked) => blocked.target)
	target!: Blocked[];

	// channel relation
	@OneToMany(() => Channel, (channel: Channel) => channel.owner)
	owner!: Channel[]

	// administrator relation
	@OneToMany(() => Administrator, (administrator: Administrator) => administrator.user)
	userAdministrator!: Administrator[];

	// banned relation
	@OneToMany(() => Banned, (banned: Banned) => banned.user)
	userBanned!: Banned[];

	// participant relation
	@OneToMany(() => Participant, (participant: Participant) => participant.user)
	userParticipant!: Participant[];

	// message relation
	@OneToMany(() => Message, (message: Message) => message.sender)
	sender!: Message[];
}