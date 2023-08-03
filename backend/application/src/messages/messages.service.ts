import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto';
import { UpdateMessageDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return await this.prisma.message.create({ data: createMessageDto });
  }

  async findAll() {
    return await this.prisma.message.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.message.findUnique({ where: { id } });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    return await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.message.delete({ where: { id } });
  }
}
//TODO: pagination
