import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CreateMatchDto, UpdateMatchDto } from './dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    return await this.prisma.match.create({ data: createMatchDto });
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
