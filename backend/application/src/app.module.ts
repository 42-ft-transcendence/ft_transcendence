import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { AdministratorModule } from './administrator/administrator.module';
import { BanModule } from './ban/ban.module';
import { BlockModule } from './block/block.module';
import { ChannelPasswordModule } from './channel-password/channel-password.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { ParticipantModule } from './participant/participant.module';
import { FollowModule } from './follow/follow.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    MatchModule,
    FollowModule,
    AdministratorModule,
    BanModule,
    BlockModule,
    ChannelPasswordModule,
    ChannelModule,
    MessageModule,
    ParticipantModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
