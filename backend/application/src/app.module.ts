import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelPasswordsModule } from './channel-passwords/channel-passwords.module';
import { MessagesModule } from './messages/messages.module';
import { ParticipantsModule } from './participants/participants.module';
import { AdministratorsModule } from './administrators/administrators.module';
import { BansModule } from './bans/bans.module';
import { BlocksModule } from './blocks/blocks.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    UsersModule,
    FollowsModule,
    ChannelsModule,
    ChannelPasswordsModule,
    MessagesModule,
    ParticipantsModule,
    AdministratorsModule,
    BansModule,
    BlocksModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
