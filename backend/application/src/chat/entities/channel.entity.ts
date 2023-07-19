import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ChannelTypeEnum } from "./channel-type.enum"
import { User } from "src/users/entities/user.entity";
import { Administrator } from "./administrator.entity";
import { Banned } from "./banned.entity";
import { Participant } from "./participant.entity";
import { Message } from "./message.entity";
import { ChannelPassword } from "./channel-password.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.owner, {
		nullable: false,
		onUpdate: "CASCADE",
		// TODO: check - onDelete는 기본값인 "NO ACTION"으로 두고 owner인 사용자가 탈퇴 시 다음의 작업을 사용자를 제거하기 위한 트랜잭션의 일부로 수행한다.
		// 1. 관리자 목록을 확인해서 가장 먼저 관리자가 된 사용자를 이 채널의 owner로 만든다.
		// 2. 관리자가 한 명도 없는 채널이라면 전체 참여자 중 한 명을 임의로 소유자로 지정하기. -> 프론트에서 소유자가 되었다는 정보를 띄운다.
		// 3. 만약 참여자도 없는 채널이라면 채널을 제거
		// TODO: 채널 소유자인 사용자가 탈퇴를 할 때, 관련된 작업을 묶은 트랜잭션이 실패할 경우, 탈퇴 불가 처리를 하는 게 맞는지 고민해보기
	})
	@JoinColumn({ name: "owner_id" })
	owner!: User;

	@Column({ type: "text", nullable: false })
	name!: string;

	@Column({ type: "enum", enum: ChannelTypeEnum, default: ChannelTypeEnum.PUBLIC, nullable: false })
	type!: ChannelTypeEnum;

	@CreateDateColumn({ type: "timestamp", nullable: false })
	created_at: Date;

	// Administrator relation
	@OneToMany(() => Administrator, (administrator) => administrator.channel)
	channel_administrator: Administrator[]

	// banned relation
	@OneToMany(() => Banned, (banned) => banned.channel)
	channel_banned: Banned[]

	// participant relation
	@OneToMany(() => Participant, (participant) => participant.channel)
	channel_participant: Participant[]

	// message relation
	@OneToMany(() => Message, (message) => message.channel)
	channel_message: Message[]

	// channel-password relation
	@OneToOne(() => ChannelPassword, (password) => password.channel)
	channel_password: ChannelPassword;
}