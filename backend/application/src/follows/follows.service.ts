import { Injectable } from '@nestjs/common';
import { CreateFollowDto, UpdateFollowDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}
  //TODO: 인증을 통해 현재 사용자의 User 테이블 id 값이 createFollowDto의 followerId와 같은지 확인하기
  //TODO: followerId와 followeeId가 서로 다른지 확인하기
  //TODO: 데이터베이스 테이블에 이미 동일한 행이 존재하는지 먼저 확인하기
  async create(createFollowDto: CreateFollowDto) {
    return await this.prisma.follow.create({ data: createFollowDto });
  }

  async findAll() {
    return await this.prisma.follow.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.follow.findUniqueOrThrow({ where: { id: id } });
  }

  async update(id: number, updateFollowDto: UpdateFollowDto) {
    return await this.prisma.follow.update({
      where: { id },
      data: updateFollowDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.follow.delete({ where: { id } });
  }
  //TODO: 인증을 통해 현재 사용자의 User 테이블 id 값이 createFollowDto의 followerId와 같은지 확인하기
  //TODO: 관계를 가진 엔티티를 같이 로드해서 반환하게 구현하기
  //TODO: pagination 적용하기
  async findMany(followerId: number) {
    return await this.prisma.follow.findMany({
      where: {
        followerId: followerId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
  //TODO: 인증을 통해 현재 사용자의 User 테이블 id 값이 createFollowDto의 followerId와 같은지 확인하기
  //TODO: followerId와 followeeId가 서로 다른지 확인하기
  async removeByIds(followerId: number, followeeId: number) {
    return await this.prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId: followerId,
          followeeId: followeeId,
        },
      },
    });
  }
}
