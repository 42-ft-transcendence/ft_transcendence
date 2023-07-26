import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Blocked {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user: User) => user.userBlocked, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 사용자가 소통을 막은 유저들에 대한 정보를 담는 테이블이므로, 제거될 사용자가 블록한 다른 사용자들에 대한 정보도 제거하는 게 맞다.
	})
	@JoinColumn({ name: "account_id" })
	user!: User;

	// @Column({ type: "int", nullable: false })
	@ManyToOne(() => User, (user: User) => user.target, {
		nullable: false,
		onDelete: "CASCADE", // TODO: check - 블록 당한 유저가 데이터베이스에서 제거됐다면, 해당 유저에 대한 블록 정보도 제거되는 게 맞다. 굳이 블록 유저 목록에 "알 수 없는 유저" 같이 표현할 게 아니라면!
	})
	@JoinColumn({ name: "target_id" })
	target!: User;
}