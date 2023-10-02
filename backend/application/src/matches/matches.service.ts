import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CreateMatchDto, UpdateMatchDto } from './dto';

@Injectable()
export class MatchesService {
	constructor(private prisma: PrismaService) {}

	async create(createMatchDto: CreateMatchDto) {
		return await this.prisma.match.create({ data: createMatchDto });
	}

	async findTop5(userId: number) {
		return await this.prisma.match.findMany({
			where: { OR: [{ winnerId: userId }, { loserId: userId }] },
			orderBy: { matchAt: 'desc' },
			take: 5,
			select: {
				winner: { select: { id: true, avatar: true, nickname: true } },
				loser: { select: { id: true, avatar: true, nickname: true } },
			},
		});
	}

	async findOneOfUser(userId: number) {
		return await this.prisma.match.findMany({
			where: { OR: [{ winnerId: userId }, { loserId: userId }] },
			orderBy: { matchAt: 'desc' },
			select: {
				type: true,
				mapType: true,
				matchAt: true,
				winnerId: true,
				loserId: true,
				winner: { select: { avatar: true, nickname: true } },
				loser: { select: { avatar: true, nickname: true } },
			},
		});
	}

	async findAll() {
		return await this.prisma.match.findMany();
	}

	async findOne(id: number) {
		return await this.prisma.match.findUniqueOrThrow({ where: { id } });
	}

	async update(id: number, updateMatchDto: UpdateMatchDto) {
		return await this.prisma.match.update({
			where: { id },
			data: updateMatchDto,
		});
	}

	async remove(id: number) {
		return await this.prisma.match.delete({ where: { id } });
	}
}
