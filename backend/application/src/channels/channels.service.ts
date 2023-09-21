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
		userId: number,
		userName: string,
		createDirectChannelDto: CreateDirectChannelDto,
	) {
		const { interlocatorId, interlocatorName } = createDirectChannelDto;
		const selectArg = {
			id: true,
			participants: {
				where: { userId: interlocatorId },
				select: {
					user: { select: { id: true, nickname: true, avatar: true } },
				},
			},
		};

		return await this.prisma.$transaction(async (tx) => {
			let activeDirectMessageChannel: any = await tx.channel.findFirst({
				where: {
					type: ChannelType.ONETOONE,
					AND: [
						{ messages: { some: { senderId: userId } } },
						{ messages: { some: { senderId: interlocatorId } } },
					],
				},
			});

			if (activeDirectMessageChannel) {
				// 둘 다 탈퇴하지 않았고, 둘 사이에 대화를 나눴던 채널이 존재할 때. ( 둘 다 채널을 나간 건 상관 없음 )
				const channelId = activeDirectMessageChannel.id;
				await tx.participant.upsert({
					where: {
						channelId_userId: { channelId: channelId, userId: userId },
					},
					update: {},
					create: { channelId: channelId, userId: userId },
				});
				const participantInterlocator = await tx.participant.upsert({
					where: {
						channelId_userId: { channelId: channelId, userId: interlocatorId },
					},
					update: {},
					create: { channelId: channelId, userId: interlocatorId },
					select: { user: { select: { nickname: true, avatar: true } } },
				});
				activeDirectMessageChannel = {
					...activeDirectMessageChannel,
					participants: [participantInterlocator],
				};
			} else {
				// 둘 사이에 대화를 나눴던 채널이 존재하지 않을 때
				activeDirectMessageChannel = await tx.channel.create({
					data: {
						name: `${userName}, ${interlocatorName}`,
						type: ChannelType.ONETOONE,
						ownerId: userId,
						participants: {
							create: [{ userId: userId }, { userId: interlocatorId }],
						},
						messages: {
							create: [
								{ content: 'INIT', senderId: userId },
								{ content: 'INIT', senderId: interlocatorId },
							],
						},
					},
					select: selectArg,
				});
			}
			return {
				id: activeDirectMessageChannel.id,
				userId: activeDirectMessageChannel.participants[0].user.id,
				userName: activeDirectMessageChannel.participants[0].user.nickname,
				avatar: activeDirectMessageChannel.participants[0].user.avatar,
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

	async findOneInDetail(userId: number, channelId: number) {
		return await this.prisma.channel.findUniqueOrThrow({
			where: { id: channelId },
			include: {
				messages: {
					skip: 2,
					select: {
						content: true,
						createdAt: true,
						sender: { select: { id: true, nickname: true, avatar: true } },
					},
				},
				_count: { select: { participants: true } },
				owner: { select: { nickname: true } },
			},
		});
		//TODO: id  순서대로 정렬되어있는지, createAt으로 정렬하지 않아도 되는지 확인하기
	}

	async findContents(userId: number, channelId: number) {
		const contents = await this.prisma.channel.findUniqueOrThrow({
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
					messages: {
						where: { senderId: { not: id } },
						select: {
							sender: { select: { id: true, nickname: true, avatar: true } },
						},
					},
				},
			})
		).map((result) => ({
			channelId: result.id,
			userId: result.messages[0]?.sender?.id,
			avatar: result.messages[0]?.sender?.avatar,
			userName: result.messages[0]?.sender?.nickname,
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
