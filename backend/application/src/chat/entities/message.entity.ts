import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel: Channel) => channel.channelMessage, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 채널이 제거된 경우엔 당연히 해당 채널의 메시지들이 제거되는 게 맞다.
	})
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.sender, {
		onDelete: "SET NULL", // TOOD: check - 메시지를 보낸 사용자가 탈퇴했다 해서 메시지 정보도 데이터베이스에서 제거하면 이후 해당 채널을 확인할 때 대화가 성립되지 않으므로 "알 수 없는 유저"로 두고 메시지는 유지한다. 프론트에서는 이 컬럼 값이 NULL이면 "알 수 없는 유저"로 표시해야 한다.
	})
	@JoinColumn({ name: "sender_id" })
	sender!: User;

	@Column({ type: "text", nullable: false })
	content!: string;

	@CreateDateColumn({ type: "timestamp", nullable: false, name: "created_at" })
	createdAt!: Date;
}