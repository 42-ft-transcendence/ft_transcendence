import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../user/user.entity";

@Entity()
export class Follow {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@ManyToOne(() => User, (user: User) => user.following, {
		nullable: false,
		onDelete: "CASCADE", //TODO: check - 사용자가 탈퇴해서 user 테이블에서 해당 사용자 정보를 제거했을 땐 친구 정보도 삭제하는 게 맞음
	})
	@JoinColumn({ name: "following_account_id" })
	following!: User;

	@ManyToOne(() => User, (user: User) => user.followed, {
		nullable: false,
		onDelete: "CASCADE", //TODO: check - 사용자가 탈퇴해서 user 테이블에서 해당 사용자 정보를 제거했을 땐 친구 정보도 삭제하는 게 맞음
	})
	@JoinColumn({ name: "followed_account_id" })
	followed!: User;
}
