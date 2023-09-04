import { Injectable } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService, hash } from 'src/common';
import {
	CreateChannelDto,
	CreateDirectChannelDto,
	QueryChannelDto,
	QueryNameChannelDto,
	UpdateChannelDto,
} from './dto';

@Injectable()
export class ChannelsService {
	constructor(private prisma: PrismaService) {}

	async create(createChannelDto: CreateChannelDto) {
		const { password, ...essential } = createChannelDto;
		return await this.prisma.channel.create({
			data: {
				...essential,
				password: password ? { create: { password: password } } : undefined,
				administrators: { create: [{ userId: essential.ownerId }] },
				participants: { create: [{ userId: essential.ownerId }] },
			},
		});
	}

	async findOrCreateDirectChannel(
		ownerId: number,
		userName: string,
		createDirectChannelDto: CreateDirectChannelDto,
	) {
		const { interlocatorId, interlocatorName } = createDirectChannelDto;

		const selectArg = {
			id: true,
			participants: {
				where: { userId: interlocatorId },
				select: { user: { select: { nickname: true, avatar: true } } },
			},
		};

		return await this.prisma.$transaction(async (tx) => {
			const oldChannel = await tx.channel.findFirst({
				where: {
					AND: [
						{ type: ChannelType.ONETOONE },
						{ messages: { some: { senderId: { equals: ownerId } } } },
						{ messages: { some: { senderId: { equals: interlocatorId } } } },
					],
				},
				select: { id: true },
			});

			let result: any;

			if (oldChannel) {
				result = await tx.channel.update({
					where: { id: oldChannel.id },
					data: {
						participants: { create: { userId: ownerId } },
					},
					select: selectArg,
				});
			} else {
				result = await tx.channel.create({
					data: {
						name: `${userName}, ${interlocatorName}`,
						type: ChannelType.ONETOONE,
						ownerId: ownerId,
						administrators: { create: [{ userId: ownerId }] },
						participants: {
							create: [{ userId: ownerId }, { userId: interlocatorId }],
						},
						messages: {
							create: [
								{ content: 'INIT', senderId: ownerId },
								{ content: 'INIT', senderId: interlocatorId },
							],
						},
					},
					select: selectArg,
				});
			}
			return {
				id: result.id,
				userName: result.participants[0].user.nickname,
				avatar: result.participants[0].user.avatar,
			};
		});
	}

	async findAll(queryChannelDto: QueryChannelDto) {
		return await this.prisma.channel.findMany({
			where: { type: { in: queryChannelDto.type } },
		});
	}

	async findAllWithName(queryNameChannelDto: QueryNameChannelDto) {
		return await this.prisma.channel.findMany({
			where: {
				type: { in: queryNameChannelDto.type },
				name: { contains: queryNameChannelDto.partialName },
			},
		});
	}
	async findOne(id: number) {
		return await this.prisma.channel.findUniqueOrThrow({ where: { id } });
	}

	async findOneInDetail(userName: string, channelId: number) {
		const result = await this.prisma.channel.findUniqueOrThrow({
			where: { id: channelId },
			include: {
				messages: {
					select: {
						content: true,
						createdAt: true,
						sender: { select: { nickname: true, avatar: true } },
					},
				},
				_count: { select: { participants: true } },
				owner: { select: { nickname: true } },
			},
		});
		if (result.type === ChannelType.ONETOONE)
			//TODO: id  순서대로 정렬되어있는지, createAt으로 정렬하지 않아도 되는지 확인하기
			result.messages.splice(0, 2);
		result.messages = result.messages.map((message) => ({
			...message,
			isMine: userName === message.sender.nickname,
		}));
		return result;
	}

	async findContents(userId: number, channelId: number) {
		const contents = await this.prisma.channel.findUnique({
			where: { id: channelId },
			select: {
				ownerId: true,
				participants: {
					select: {
						user: { select: { id: true, nickname: true, avatar: true } },
					},
				},
				administrators: {
					select: {
						user: { select: { id: true, nickname: true, avatar: true } },
					},
				},
				bans: {
					select: {
						user: { select: { id: true, nickname: true, avatar: true } },
					},
				},
			},
		});
		contents['isOwner'] = contents.ownerId === userId;
		delete contents.ownerId;
		contents['isAdmin'] = contents.administrators.some(
			(a) => a.user.id === userId,
		);
		return contents;
	}

	async findByName(name: string) {
		return await this.prisma.channel.findMany({
			where: { name: { contains: name } },
		});
	}

	async findChannelsUserIn(id: number) {
		return (
			await this.prisma.participant.findMany({
				where: {
					userId: id,
					channel: { type: { in: ['PUBLIC', 'PRIVATE', 'PROTECTED'] } },
				},
				select: {
					channel: { select: { name: true, type: true, id: true } },
				},
			})
		).map((result) => result.channel);
	}

	async findDirectsUserIn(id: number) {
		return (
			await this.prisma.channel.findMany({
				where: { type: 'ONETOONE', participants: { some: { userId: id } } },
				select: {
					id: true,
					participants: {
						where: { userId: { not: id } },
						select: {
							user: { select: { id: true, nickname: true, avatar: true } },
						},
					},
				},
			})
		).map((result) => ({
			channelId: result.id,
			userId: result.participants[0].user.id,
			avatar: result.participants[0].user.avatar,
			userName: result.participants[0].user.nickname,
		}));
	}

	async update(id: number, updateChannelDto: UpdateChannelDto) {
		const { name, type, ownerId, password } = updateChannelDto;
		const updateChannelObject = { name: name, type: type, ownerId: ownerId };
		//TODO: password에 hash 적용하기
		if (type === ChannelType.PROTECTED) {
			const hashed = await hash(password);
			updateChannelObject['password'] = {
				upsert: {
					create: { password: hashed },
					update: { password: hashed },
				},
			};
		}
		return await this.prisma.channel.update({
			where: { id },
			data: updateChannelObject,
		});
	}

	async remove(id: number) {
		return await this.prisma.channel.delete({ where: { id } });
	}
}
//TODO: 비즈니스 로직에 따라 channel 엔티티를 클라이언트에 전달할 때, channel-password도 include 옵션으로 함께 로드해서 반환해야 한다면, 다음 링크를 참고해서 password 속성을 제외하고 반환하기
//https://www.prisma.io/blog/nestjs-prisma-relational-data-7D056s1kOabc#returning-the-author-along-with-an-article
