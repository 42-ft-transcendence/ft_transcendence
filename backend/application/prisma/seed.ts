// this file populates some data.
// to do this, you need to register below code at package.json
// "prisma" : {
//   "seed": "ts-node ./prisma/seed.ts"
// }
// and use command "npx prisma db seed"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const post1 = await prisma.user.upsert({
    where: { nickname: 'jim' },
    update: {},
    create: {
      nickname: 'jim',
      avatar: 'jim_avatar_path',
    },
  });

  const post2 = await prisma.user.upsert({
    where: { nickname: 'jom' },
    update: {},
    create: {
      nickname: 'jom',
      avatar: 'jom_avatar_path',
    },
  });

  console.log({ post1, post2 });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // one should do this if one initialize prisma using short lived script because prisma has not enough time to handle the shutdown and stuff. one doesn't need this in an application web server
  });
