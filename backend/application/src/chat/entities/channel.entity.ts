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
	@ManyToOne(() => User, (user) => user.owner, { nullable: false })
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