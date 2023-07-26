import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../user/user.entity";

@Entity()
export class Friendship {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@ManyToOne(() => User, (user: User) => user.firstUser, {
		nullable: false,
		onDelete: "CASCADE", //TODO: check - 사용자가 탈퇴해서 user 테이블에서 해당 사용자 정보를 제거했을 땐 친구 정보도 삭제하는 게 맞음
	})
	@JoinColumn({ name: "first_account_id" })
	firstUser!: User;

	@ManyToOne(() => User, (user: User) => user.secondUser, {
		nullable: false,
		onDelete: "CASCADE", //TODO: check - 사용자가 탈퇴해서 user 테이블에서 해당 사용자 정보를 제거했을 땐 친구 정보도 삭제하는 게 맞음
	})
	@JoinColumn({ name: "second_account_id" })
	secondUser!: User;
}
