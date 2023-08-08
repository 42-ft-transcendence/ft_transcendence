import { Injectable } from '@nestjs/common';
import { CreateChannelPasswordDto, UpdateChannelPasswordDto } from './dto';
import { PrismaService, hash } from 'src/common';

@Injectable()
export class ChannelPasswordsService {
  constructor(private prisma: PrismaService) {}
  //TODO: password에 hash 적용하기
  //TODO: 얘가 필요한 함수인지 고민해보기 나머지 모든 자원들의 모든 함수들도 다!
  async create(createChannelPasswordDto: CreateChannelPasswordDto) {
    const { password, channelId } = createChannelPasswordDto;
    return await this.prisma.channelPassword.create({
      data: { password: await hash(password), channelId: channelId },
    });
  }

  async findAll() {
    return await this.prisma.channelPassword.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.channelPassword.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateChannelPasswordDto: UpdateChannelPasswordDto) {
    return await this.prisma.channelPassword.update({
      where: { id },
      data: { password: await hash(updateChannelPasswordDto.password) },
    });
  }

  async remove(id: number) {
    return await this.prisma.channelPassword.delete({
      where: { id },
    });
  }
}
