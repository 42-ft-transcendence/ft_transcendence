import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { DataSource } from 'typeorm';
import { customFollowRepository } from './follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  controllers: [FollowController],
  providers: [
    {
      provide: getRepositoryToken(Follow),
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Follow).extend(customFollowRepository);
      }
    },
    FollowService]
})
export class FollowModule { }
