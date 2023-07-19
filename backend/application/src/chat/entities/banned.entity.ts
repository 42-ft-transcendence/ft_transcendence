import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Banned {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel) => channel.channel_banned, {
		nullable: false,
		onUpdate: "CASCADE",
		onDelete: "CASCADE", // TODO: check - 참조되는 채널이 데이터베이스에서 삭제됐다면, 해당 채널의 banned users에 대한 정보를 유지할 필요가 없다.
	})
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.user_banned, {
		nullable: false,
		onUpdate: "CASCADE",
		onDelete: "CASCADE", // TODO: check - 참조되는 채널이 데이터베이스에서 삭제됐다면, 해당 채널의 banned users에 대한 정보를 유지할 필요가 없다.
	})
	@JoinColumn({ name: "user_id" })
	user!: User;
}