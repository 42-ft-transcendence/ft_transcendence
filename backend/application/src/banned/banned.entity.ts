import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "../channel/channel.entity";
import { User } from "src/user/user.entity";

@Entity()
export class Banned {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel: Channel) => channel.channelBanned, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 참조되는 채널이 데이터베이스에서 삭제됐다면, 해당 채널의 banned users에 대한 정보를 유지할 필요가 없다.
	})
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user: User) => user.userBanned, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 참조되는 채널이 데이터베이스에서 삭제됐다면, 해당 채널의 banned users에 대한 정보를 유지할 필요가 없다.
	})
	@JoinColumn({ name: "account_id" })
	user!: User;
}