import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';
import { FourtyTwoUser, PrismaService } from 'src/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	// async create(createUserDto: CreateUserDto) {
	// 	return await this.prisma.user.create({ data: createUserDto });
	// }
	async createDefault(userInfo: FourtyTwoUser, customNickname: string) {
		const response = await axios.get(userInfo.avatar, {
			responseType: 'arraybuffer',
		});
		fs.writeFile(
			`./avatar-upload/${userInfo.nickname}_avatar.jpg`,
			response.data,
			(err) => {
				if (err) throw err;
			},
		);
		return await this.prisma.user.create({
			data: {
				fourtyTwoId: userInfo.fourtyTwoId,
				nickname: customNickname ? customNickname : userInfo.nickname,
				avatar: `avatar-upload/${userInfo.nickname}_avatar.jpg`,
			},
		});
	}

	async createCustom(
		userInfo: FourtyTwoUser,
		customNickname: string,
		avatar: Express.Multer.File,
	) {
		return await this.prisma.user.create({
			data: {
				fourtyTwoId: userInfo.fourtyTwoId,
				nickname: customNickname ? customNickname : userInfo.nickname,
				avatar: avatar.path ? avatar.path : userInfo.avatar,
			},
		});
	}

	async findAll(id: number): Promise<User[]> {
		return await this.prisma.user.findMany({
			where: { id: { not: id } },
		});
	}

	async findOneSelf(id: number) {
		return await this.prisma.user.findUniqueOrThrow({ where: { id } });
	}

	async findByName(id: number, name: string) {
		return await this.prisma.user.findMany({
			where: { id: { not: id }, nickname: { contains: name } },
		});
	}

	async findOne(id: number): Promise<User> {
		return await this.prisma.user.findUniqueOrThrow({ where: { id } });
	}

	async findOneByFourtyTwoId(fourtyTwoId: number): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { fourtyTwoId: fourtyTwoId },
		});
	}

	async setOtpSecret(secret: string, userId: number) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { otpSecret: secret },
		});
	}

	async switchTwoFactorAuthentication(userId: number, flag: boolean) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { is2FAEnabled: flag },
		});
	}
	//TODO: 존재하는 channel id, user id인지는 데이터베이스 자체적으로 체크할 수 있다.
	// async ban(userId: number, channelId: number) {
	// 	return await this.prisma.user.update({
	// 		where: { id: userId },
	// 		data: {
	// 			bans: { create: { channelId: channelId } },
	// 			participants: {
	// 				delete: {
	// 					channelId_userId: { channelId: channelId, userId: userId },
	// 				},
	// 			},
	// 		},
	// 		select: { id: true, nickname: true, avatar: true },
	// 	});
	// }

	// async kick(userId: number, channelId: number) {
	// 	return await this.prisma.user.update({
	// 		where: { id: userId },
	// 		data: {
	// 			participants: {
	// 				delete: {
	// 					channelId_userId: { channelId: channelId, userId: userId },
	// 				},
	// 			},
	// 		},
	// 		select: { id: true, nickname: true, avatar: true },
	// 	});
	// }

	async update(id: number, updateUserDto: UpdateUserDto) {
		return await this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	async remove(id: number) {
		return await this.prisma.user.delete({
			where: { id },
		});
	}
}
