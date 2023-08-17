import { Injectable } from '@nestjs/common';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class ParticipantsService {
	constructor(private prisma: PrismaService) { }

	async create(createParticipantDto: CreateParticipantDto) {
		return await this.prisma.participant.create({ data: createParticipantDto });
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
		return await this.prisma.participant.delete({ where: { id } });
	}
}
