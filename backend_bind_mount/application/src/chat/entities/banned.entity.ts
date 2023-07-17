import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Banned {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@OneToMany(() => Channel, (channel) => channel.channel_banned, { nullable: false })
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@OneToMany(() => User, (user) => user.user_banned, { nullable: false })
	@JoinColumn({ name: "user_id" })
	user!: User;
}