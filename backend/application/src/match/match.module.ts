import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { customMatchRepository } from './match.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [
    {
      provide: getRepositoryToken(Match),
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Match).extend(customMatchRepository);
      },
    },
    MatchService
  ]
})
export class MatchModule { }
