// this file populates some data.
// to do this, you need to register below code at package.json
// "prisma" : {
//   "seed": "ts-node ./prisma/seed.ts"
// }
// and use command "npx prisma db seed"
import { ChannelType, MapType, MatchType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker'
import { generateUniqueRandomStrings } from './seed-tool';

const prisma = new PrismaClient();

async function seed() {
  const userCount = 10000;
  const channelCount = 200;
  const followCount = 20000;

  // 시간이 많이 걸림...
  // const userNicknames = faker.helpers.uniqueArray(() => faker.word.noun({ length: { min: 3, max: 10 } }), userCount);
  // const userAvatars = faker.helpers.uniqueArray(faker.internet.avatar, userCount);
  // const channelNames = faker.helpers.uniqueArray(faker.internet.domainWord, userCount);

  const userNicknames = generateUniqueRandomStrings(userCount, 5);
  const userAvatars = generateUniqueRandomStrings(userCount, 30);
  const channelNames = generateUniqueRandomStrings(channelCount, 20);

  // create users
  await prisma.user.createMany({
    data: Array.from({
      length: userCount
    }).map((_, i) => ({
      nickname: userNicknames.at(i),
      avatar: userAvatars.at(i)
    })),
  });

  const userIds = (await prisma.user.findMany()).map((user) => (user.id));

  // create channels
  await prisma.channel.createMany({
    data: Array.from({
      length: channelCount
    }).map((_, i) => ({
      name: channelNames.at(i),
      type: faker.helpers.enumValue(ChannelType),
      ownerId: faker.helpers.arrayElement(userIds)
    })),
  });

  const protectedChannels = (await prisma.channel.findMany({
    where: { type: ChannelType.PROTECTED }
  })).map((channel) => channel.id);

  // create passwords for protected channels
  await prisma.channelPassword.createMany({
    data: Array.from({
      length: protectedChannels.length
    }).map((_, i) => ({
      channelId: protectedChannels.at(i),
      password: faker.internet.password()
    })),
  });

  const channelIds = (await prisma.channel.findMany()).map((channel) => (channel.id));
  //TODO: 채널 소유자를 participant나 administrator 테이블에 저장할 지 아니면 쿼리를 이용할 지 고민해보기.
  // create participants
  channelIds.map(async (id) => {
    await prisma.participant.createMany({
      data: Array.from({
        length: faker.number.int({
          min: 0, max: 100
        })
      }).map(() => ({
        channelId: id,
        userId: faker.helpers.arrayElement(userIds),
      })),
      skipDuplicates: true,
    })
  });

  // create administrators
  channelIds.map(async (id) => {
    const participantIds = (await prisma.participant.findMany({
      where: { channelId: id }
    })).map((result) => result.userId);

    const administrators = Array.from({
      length: faker.number.int({
        min: 0, max: participantIds.length > 5 ? 5 : participantIds.length
      })
    }).map(() => ({
      channelId: id,
      userId: faker.helpers.arrayElement(participantIds)
    }));

    await prisma.administrator.createMany({
      data: administrators,
      skipDuplicates: true,
    });
  });

  // create messages
  // 같은 결과지만 userIds.map(...)과 같은 방식으로 쿼리를 실행하면 훨씬 오래 걸린다.
  // 사용자 수가 채널 수보다 훨씬 많기 때문에, 쿼리를 훨씬 많이 던지기 때문이다.
  channelIds.map(async (id) => {
    const channelParticipants = (await prisma.participant.findMany({
      where: { channelId: id }
    })).map((p) => p.userId);


    if (channelParticipants.length > 0) {
      const messages = Array.from({
        length: faker.number.int({ min: 0, max: 1000 })
      }).map(() => ({
        content: faker.lorem.sentences({ min: 1, max: 5 }),
        channelId: id,
        senderId: faker.helpers.arrayElement(channelParticipants)
      }));

      await prisma.message.createMany({
        data: messages
      })
    }
  });

  const matches = Array.from({ length: 50000 }).map(() => {
    const ids = faker.helpers.arrayElements(userIds, 2);

    return {
      type: faker.helpers.enumValue(MatchType),
      mapType: faker.helpers.enumValue(MapType),
      matchAt: new Date(),
      winnerId: ids[0],
      loserId: ids[1],
    };
  });
  // create match
  await prisma.match.createMany({
    data: matches
  });


  const followes = Array.from({ length: 20000 }).map(() => {
    const ids = faker.helpers.arrayElements(userIds, 2);

    return {
      followerId: ids[0],
      followeeId: ids[1],
    };
  });

  // create followes
  await prisma.follow.createMany({
    data: followes, skipDuplicates: true
  });

  const blocks = Array.from({ length: 100 }).map(() => {
    const ids = faker.helpers.arrayElements(userIds, 2);

    return {
      blockerId: ids[0],
      blockeeId: ids[1],
    };
  });

  // create blocks
  await prisma.block.createMany({
    data: blocks, skipDuplicates: true
  });

  const bans = Array.from({ length: 100 }).map(() => {
    const channel = faker.helpers.arrayElement(channelIds)
    const user = faker.helpers.arrayElement(userIds);

    return {
      channelId: channel,
      userId: user,
    };
  });

  // create bans
  await prisma.ban.createMany({
    data: bans, skipDuplicates: true
  });
}

async function clear() {
  await prisma.ban.deleteMany();
  await prisma.block.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.match.deleteMany();
  await prisma.message.deleteMany();
  await prisma.administrator.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.channelPassword.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  seed();
  // clear();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // one should do this if one initialize prisma using short lived script because prisma has not enough time to handle the shutdown and stuff. one doesn't need this in an application web server
  });
