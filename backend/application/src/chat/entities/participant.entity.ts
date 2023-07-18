import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Participant {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel) => channel.channel_participant, { nullable: false })
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.user_participant, { nullable: false })
	@JoinColumn({ name: "user_id" })
	user!: User;
}