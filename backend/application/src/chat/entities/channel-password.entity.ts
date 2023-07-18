import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";

@Entity()
export class ChannelPassword {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@OneToOne(() => Channel, (channel) => channel.channel_password, { nullable: false })
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	@Column({ type: "varchar", length: 20, nullable: false })
	password!: string;
}