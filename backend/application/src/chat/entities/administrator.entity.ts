import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Administrator {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => Channel, (channel) => channel.channel_administrator, {
		nullable: false,
		onUpdate: "CASCADE",
		onDelete: "CASCADE"	// TODO: check - 이 외래키가 참조하는 채널이 데이터베이스에서 제거되면 해당 채널의 관리자들에 대한 정보는 모두 불필요해지므로 지우는 게 당연하다.
	})
	@JoinColumn({ name: "channel_id" })
	channel!: Channel;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user) => user.user_administrator, {
		nullable: false,
		onUpdate: "CASCADE",
		onDelete: "CASCADE"	// TODO: check - 이 외래키가 참조하는 채널이 데이터베이스에서 제거되면 해당 채널의 관리자들에 대한 정보는 모두 불필요해지므로 지우는 게 당연하다.
	})
	@JoinColumn({ name: "user_id" })
	user!: User;

	@CreateDateColumn({ type: "timestamp", nullable: false })
	created_at!: Date;
}