import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity";

@Entity()
export class Friendship {
	@PrimaryGeneratedColumn({ type: "int" })
	id!: number;

	@ManyToOne(() => User, (user) => user.first_user, { nullable: false })
	@JoinColumn({ name: "first_user_id" })
	first_user!: User;

	@ManyToOne(() => User, (user) => user.second_user, { nullable: false })
	@JoinColumn({ name: "second_user_id" })
	second_user!: User;
}
