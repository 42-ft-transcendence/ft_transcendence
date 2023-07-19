import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity";

@Entity()
export class Friendship {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@ManyToOne(() => User, (user) => user.first_user, {
		nullable: false,
		onDelete: "CASCADE", //TODO: check - 사용자가 탈퇴해서 user 테이블에서 해당 사용자 정보를 제거했을 땐 친구 정보도 삭제하는 게 맞음
	})
	@JoinColumn({ name: "first_user_id" })
	first_user!: User;

	@ManyToOne(() => User, (user) => user.second_user, {
		nullable: false,
		onDelete: "CASCADE", //TODO: check - 사용자가 탈퇴해서 user 테이블에서 해당 사용자 정보를 제거했을 땐 친구 정보도 삭제하는 게 맞음
	})
	@JoinColumn({ name: "second_user_id" })
	second_user!: User;
}
