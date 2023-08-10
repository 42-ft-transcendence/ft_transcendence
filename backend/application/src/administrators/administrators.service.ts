import { Injectable } from '@nestjs/common';
import { CreateAdministratorDto, UpdateAdministratorDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class AdministratorsService {
  constructor(private prisma: PrismaService) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    return await this.prisma.participant.create({
      data: createAdministratorDto,
    });
  }

  async findAll() {
    return await this.prisma.participant.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.participant.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    return await this.prisma.participant.update({
      where: { id },
      data: updateAdministratorDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.participant.delete({ where: { id } });
  }
}
