import { Injectable } from '@nestjs/common';
import { CreateAdministratorDto, UpdateAdministratorDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class AdministratorsService {
  constructor(private prisma: PrismaService) { }

  async create(createAdministratorDto: CreateAdministratorDto) {
    return await this.prisma.administrator.create({
      data: createAdministratorDto,
      select: { user: { select: { id: true, nickname: true, avatar: true } } }
    }).user;
  }

  async findAll() {
    return await this.prisma.administrator.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.administrator.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    return await this.prisma.administrator.update({
      where: { id },
      data: updateAdministratorDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.administrator.delete({ where: { id } });
  }

  async removeOne(channelId: number, userId: number) {
    return await this.prisma.administrator.delete({
      where: { channelId_userId: { channelId: channelId, userId: userId } },
      select: { user: { select: { id: true, nickname: true, avatar: true } } }
    }).user;
  }
}
