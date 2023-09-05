import { Injectable } from '@nestjs/common';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class ParticipantsService {
	constructor(private prisma: PrismaService) {}

	async create(userId: number, createParticipantDto: CreateParticipantDto) {
		const result = await this.prisma.participant.create({
			data: { userId: userId, channelId: createParticipantDto.channelId },
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

	async remove(userId: number, channelId: number) {
		return (
			await this.prisma.participant.delete({
				where: { channelId_userId: { channelId: channelId, userId: userId } },
				select: {
					user: {
						select: { id: true, nickname: true, avatar: true },
					},
				},
			})
		).user;
	}
}
