import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";

@Entity()
export class ChannelPassword {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@OneToOne(() => Channel, (channel) => channel.channel_password, {
		nullable: false,
		onUpdate: "CASCADE",
		onDelete: "CASCADE",	// TODO: check - protected 채널이 제거되면, 해당 채널의 비밀번호를 담는 행 또한 제거되는 게 맞다.
	})
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	@Column({ type: "varchar", length: 20, nullable: false })
	password!: string;
}