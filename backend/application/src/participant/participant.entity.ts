import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "../channel/channel.entity";
import { User } from "src/user/user.entity";

@Entity()
export class Participant {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel: Channel) => channel.channelParticipant, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 채널이 제거되면 해당 채널의 참여자 목록도 필요없다.
	})
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user: User) => user.userParticipant, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 해당 채널의 참여자가 탈퇴한 경우, 채널의 참여자 목록에 계속 포함시킬 이유가 없다.
	})
	@JoinColumn({ name: "account_id" })
	user!: User;
}