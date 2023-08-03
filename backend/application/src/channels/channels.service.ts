import { Injectable } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService } from 'src/common';
import { CreateChannelDto, UpdateChannelDto } from './dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto) {
    const { name, type, ownerId, password } = createChannelDto;
    const createChannelObject = { name: name, type: type, ownerId: ownerId };
    //TODO: password에 hash 적용하기
    if (type === ChannelType.PROTECTED) {
      createChannelObject['password'] = { create: { password } };
    }
    return await this.prisma.channel.create({ data: createChannelObject });
  }

  async findAll() {
    return await this.prisma.channel.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.channel.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    const { name, type, ownerId, password } = updateChannelDto;
    const updateChannelObject = { name: name, type: type, ownerId: ownerId };
    //TODO: password에 hash 적용하기
    if (type === ChannelType.PROTECTED) {
      updateChannelObject['password'] = { update: { password } };
    }
    return await this.prisma.channel.update({
      where: { id },
      data: updateChannelObject,
    });
  }

  async remove(id: number) {
    return await this.prisma.channel.delete({ where: { id } });
  }
}
//TODO: 비즈니스 로직에 따라 channel 엔티티를 클라이언트에 전달할 때, channel-password도 include 옵션으로 함께 로드해서 반환해야 한다면, 다음 링크를 참고해서 password 속성을 제외하고 반환하기
//https://www.prisma.io/blog/nestjs-prisma-relational-data-7D056s1kOabc#returning-the-author-along-with-an-article
