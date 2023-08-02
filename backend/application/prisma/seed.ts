// this file populates some data.
// to do this, you need to register below code at package.json
// "prisma" : {
//   "seed": "ts-node ./prisma/seed.ts"
// }
// and use command "npx prisma db seed"
import { ChannelType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { nickname: 'jam' },
    update: {},
    create: {
      nickname: 'jam',
      avatar: 'jam_avatar_path',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { nickname: 'jem' },
    update: {},
    create: {
      nickname: 'jem',
      avatar: 'jem_avatar_path',
    },
  });
  const user3 = await prisma.user.upsert({
    where: { nickname: 'jim' },
    update: {},
    create: {
      nickname: 'jim',
      avatar: 'jim_avatar_path',
    },
  });
  const user4 = await prisma.user.upsert({
    where: { nickname: 'jom' },
    update: {},
    create: {
      nickname: 'jom',
      avatar: 'jom_avatar_path',
    },
  });
  const user5 = await prisma.user.upsert({
    where: { nickname: 'jum' },
    update: {},
    create: {
      nickname: 'jum',
      avatar: 'jum_avatar_path',
    },
  });

  const follow1 = await prisma.follow.upsert({
    where: {
      followerId_followeeId: {
        followerId: user1.id,
        followeeId: user2.id,
      },
    },
    update: {},
    create: {
      followerId: user1.id,
      followeeId: user2.id,
    },
  });
  const follow2 = await prisma.follow.upsert({
    where: {
      followerId_followeeId: {
        followerId: user1.id,
        followeeId: user3.id,
      },
    },
    update: {},
    create: {
      followerId: user1.id,
      followeeId: user3.id,
    },
  });
  const follow3 = await prisma.follow.upsert({
    where: {
      followerId_followeeId: {
        followerId: user2.id,
        followeeId: user3.id,
      },
    },
    update: {},
    create: {
      followerId: user2.id,
      followeeId: user3.id,
    },
  });

  const channel1 = await prisma.channel.upsert({
    where: {
      name: "jam's channel",
    },
    update: {},
    create: {
      name: "jam's channel",
      type: ChannelType.PUBLIC,
      ownerId: user1.id,
    },
  });
  const channel2 = await prisma.channel.upsert({
    where: {
      name: "jem's channel",
    },
    update: {},
    create: {
      name: "jem's channel",
      type: ChannelType.PRIVATE,
      ownerId: user1.id,
    },
  });
  const channel3 = await prisma.channel.upsert({
    where: {
      name: "jim's channel",
    },
    update: {},
    create: {
      name: "jem's channel",
      type: ChannelType.PROTECTED,
      ownerId: user1.id,
      password: {
        create: {
          password: 'j_implant',
        },
      },
    },
  });
  console.log({ user1, user2, user3, user4, user5 });
  console.log({ follow1, follow2, follow3 });
  console.log({ channel1, channel2, channel3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // one should do this if one initialize prisma using short lived script because prisma has not enough time to handle the shutdown and stuff. one doesn't need this in an application web server
  });
