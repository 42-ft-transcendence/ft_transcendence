import { Injectable } from '@nestjs/common';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class ParticipantsService {
	constructor(private prisma: PrismaService) {}

	async create(userId: number, createParticipantDto: CreateParticipantDto) {
		const result = await this.prisma.participant.create({
			data: { userId: userId, ...createParticipantDto },
			select: { channel: true },
		});
		return result.channel;
	}

	async findAll() {
		return await this.prisma.participant.findMany();
	}

	async findOne(id: number) {
		return await this.prisma.participant.findUniqueOrThrow({ where: { id } });
	}

	async update(id: number, updateParticipantDto: UpdateParticipantDto) {
		return await this.prisma.participant.update({
			where: { id },
			data: updateParticipantDto,
		});
	}

	async remove(id: number) {
		return await this.prisma.participant.delete({
			where: { id },
		});
	}
}
