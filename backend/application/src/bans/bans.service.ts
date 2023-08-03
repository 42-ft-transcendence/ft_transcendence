import { Injectable } from '@nestjs/common';
import { CreateBanDto, UpdateBanDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class BansService {
  constructor(private prisma: PrismaService) {}

  async create(createBanDto: CreateBanDto) {
    return await this.prisma.ban.create({ data: createBanDto });
  }

  async findAll() {
    return await this.prisma.ban.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.ban.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, updateBanDto: UpdateBanDto) {
    return await this.prisma.ban.update({ where: { id }, data: updateBanDto });
  }

  async remove(id: number) {
    return await this.prisma.ban.delete({ where: { id } });
  }
}
