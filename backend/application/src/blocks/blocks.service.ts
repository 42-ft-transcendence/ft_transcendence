import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { UpdateBlockDto } from './dto';

@Injectable()
export class BlocksService {
	constructor(private prisma: PrismaService) {}

	async create(blockerId: number, blockeeId: number) {
		return await this.prisma.block.create({
			data: { blockerId: blockerId, blockeeId: blockeeId },
			select: { blockee: true },
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
