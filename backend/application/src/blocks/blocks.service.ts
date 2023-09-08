import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { UpdateBlockDto } from './dto';
import { ChannelType } from '@prisma/client';

@Injectable()
export class BlocksService {
	constructor(private prisma: PrismaService) {}

	async create(blockerId: number, blockeeId: number) {
		return await this.prisma.$transaction(async (tx) => {
			const channel = await tx.channel.findFirst({
				where: {
					AND: [
						{ type: ChannelType.ONETOONE },
						{ participants: { some: { userId: { equals: blockerId } } } },
						{ participants: { some: { userId: { equals: blockeeId } } } },
					],
				},
				select: { id: true },
			});

			let result = await tx.block.create({
				data: { blockerId: blockerId, blockeeId: blockeeId },
				select: { blockee: true },
			});

			if (channel) {
				const channelInfo = await tx.participant.delete({
					where: {
						channelId_userId: { channelId: channel.id, userId: blockerId },
					},
					select: { channelId: true },
				});
				result = { ...result, ...channelInfo };
			}

			return result;
		});
	}

	async findAll(id: number) {
		return await this.prisma.block.findMany({
			where: { blockerId: id },
			select: { blockee: true },
		}); //TODO: is it ok to do this in backend?
	}

	async findOne(id: number) {
		return await this.prisma.block.findUniqueOrThrow({ where: { id } });
	}

	async update(id: number, updateBlockDto: UpdateBlockDto) {
		return await this.prisma.block.update({
			where: { id },
			data: updateBlockDto,
		});
	}

	async remove(blockerId: number, blockeeId: number) {
		return await this.prisma.block.delete({
			where: {
				blockerId_blockeeId: { blockerId: blockerId, blockeeId: blockeeId },
			},
			select: { blockee: true },
		});
	}
}
