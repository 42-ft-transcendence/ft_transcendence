import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Follow } from './follow/follow.entity';
import { Match } from './match/match.entity';
import { Administrator } from './administrator/administrator.entity';
import { Banned } from './banned/banned.entity';
import { Channel } from './channel/channel.entity';
import { ChannelPassword } from './channel-password/channel-password.entity';
import { Message } from './message/message.entity';
import { Participant } from './participant/participant.entity';
import { MatchModule } from './match/match.module';
import { AdministratorModule } from './administrator/administrator.module';
import { BannedModule } from './banned/banned.module';
import { BlockedModule } from './blocked/blocked.module';
import { ChannelPasswordModule } from './channel-password/channel-password.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { ParticipantModule } from './participant/participant.module';
import { Blocked } from './blocked/blocked.entity';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      entities: [
        User,
        Follow,
        Match,
        Blocked,
        Channel,
        Administrator,
        Banned,
        Participant,
        Message,
        ChannelPassword
      ],
      logging: true,
      maxQueryExecutionTime: 1000,
      // poolSize: ? // TODO: test performance on its value
      synchronize: true, // TODO: remove. database schema is auto-created on every application launch
      // cache
      host: "db", // TODO: use .env
      port: 5432, // TODO: use .env
      username: "test", //TODO: use .env
      password: "test", //TODO: use .env
      applicationName: "ft_transcendence",
    }),
    UserModule,
    MatchModule,
    FollowModule,
    AdministratorModule,
    BannedModule,
    BlockedModule,
    ChannelPasswordModule,
    ChannelModule,
    MessageModule,
    ParticipantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
