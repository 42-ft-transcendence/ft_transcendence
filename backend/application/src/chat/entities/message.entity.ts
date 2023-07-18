import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel) => channel.channel_message, { nullable: false })
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.sender, { nullable: false })
	@JoinColumn({ name: "sender_id" })
	sender!: User;

	@Column({ type: "text", nullable: false })
	content!: string;

	@CreateDateColumn({ type: "timestamp", nullable: false })
	created_at!: Date;
}