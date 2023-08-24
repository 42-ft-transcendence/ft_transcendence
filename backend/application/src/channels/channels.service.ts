import { Injectable } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService, hash } from 'src/common';
import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './dto';
import { QueryNameChannelDto } from './dto/query-name-channel.dto';
import { CreateDirectChannelDto } from './dto/create-direct-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto) {
    //TODO: custom validator를 활용함으로써 type이 'PROTECTED'면 비밀번호 속성에 값이 들어온 것이 확실하다. 따라서 hash를 적용하는 transformer를 만들어서 적용하고 if문을 제거하자.
    const { name, type, ownerId, password } = createChannelDto;
    const createChannelObject = { name: name, type: type, ownerId: ownerId };
    if (type === ChannelType.PROTECTED) {
      createChannelObject['password'] = {
        create: { password: await hash(password) },
      };
    }
    return await this.prisma.channel.create({
      data: {
        ...createChannelObject,
        administrators: { create: [{ userId: ownerId }] },
        participants: { create: [{ userId: ownerId }] },
      },
    });
  }

  async createDirectChannel(
    userName: string,
    createDirectChannelDto: CreateDirectChannelDto,
  ) {
    const { ownerId, interlocatorId, interlocatorName } =
      createDirectChannelDto;
    const result = await this.prisma.channel.create({
      data: {
        name: `${userName}, ${interlocatorName}`,
        type: ChannelType.ONETOONE,
        ownerId: ownerId,
        administrators: { create: [{ userId: ownerId }] },
        participants: {
          create: [{ userId: ownerId }, { userId: interlocatorId }],
        },
      },
      select: {
        id: true,
        participants: {
          where: { userId: interlocatorId },
          select: { user: { select: { nickname: true, avatar: true } } },
        },
      },
    });
    return {
      id: result.id,
      userName: result.participants[0].user.nickname,
      avatar: result.participants[0].user.avatar,
    };
  }

  async findAll(queryChannelDto: QueryChannelDto) {
    return await this.prisma.channel.findMany({
      where: { type: { in: queryChannelDto.type } },
    });
  }

  async findAllWithName(queryNameChannelDto: QueryNameChannelDto) {
    return await this.prisma.channel.findMany({
      where: {
        type: { in: queryNameChannelDto.type },
        name: { contains: queryNameChannelDto.partialName },
      },
    });
  }
  async findOne(id: number) {
    return await this.prisma.channel.findUniqueOrThrow({ where: { id } });
  }

  async findOneInDetail(userName: string, channelId: number) {
    const result = await this.prisma.channel.findUniqueOrThrow({
      where: { id: channelId },
      include: {
        messages: {
          select: {
            content: true,
            createdAt: true,
            sender: { select: { nickname: true, avatar: true } },
          },
        },
        _count: { select: { participants: true } },
        owner: { select: { nickname: true } },
      },
    });
    result.messages = result.messages.map((message) => ({
      ...message,
      isMine: userName === message.sender.nickname,
    }));
    return result;
  }

  async findParticipantsById(id: number) {
    return (
      await this.prisma.participant.findMany({
        where: { channelId: id },
        select: { user: { select: { nickname: true, avatar: true } } },
      })
    ).map((p) => p.user);
  }

  async findByName(name: string) {
    return await this.prisma.channel.findMany({
      where: { name: { contains: name } },
    });
  }

  async findChannelsUserIn(id: number) {
    return (
      await this.prisma.participant.findMany({
        where: {
          userId: id,
          channel: { type: { in: ['PUBLIC', 'PRIVATE', 'PROTECTED'] } },
        },
        select: {
          channel: { select: { name: true, type: true, id: true } },
        },
      })
    ).map((result) => result.channel);
  }

  async findDirectsUserIn(id: number) {
    return (
      await this.prisma.channel.findMany({
        where: { type: 'ONETOONE', participants: { some: { userId: id } } },
        select: {
          id: true,
          participants: {
            where: { userId: { not: id } },
            select: { user: { select: { nickname: true, avatar: true } } },
          },
        },
      })
    ).map((result) => ({
      channelId: result.id,
      avatar: result.participants[0].user.avatar,
      userName: result.participants[0].user.nickname,
    }));
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    const { name, type, ownerId, password } = updateChannelDto;
    const updateChannelObject = { name: name, type: type, ownerId: ownerId };
    //TODO: password에 hash 적용하기
    if (type === ChannelType.PROTECTED) {
      const hashed = await hash(password);
      updateChannelObject['password'] = {
        upsert: {
          create: { password: hashed },
          update: { password: hashed },
        },
      };
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
