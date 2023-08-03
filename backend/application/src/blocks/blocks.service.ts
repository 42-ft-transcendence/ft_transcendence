import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common';
import { CreateBlockDto, UpdateBlockDto } from './dto';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async create(createBlockDto: CreateBlockDto) {
    return await this.prisma.block.create({ data: createBlockDto });
  }

  async findAll() {
    return await this.prisma.block.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.block.findUnique({ where: { id } });
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    return await this.prisma.block.update({
      where: { id },
      data: updateBlockDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.block.delete({ where: { id } });
  }
}
