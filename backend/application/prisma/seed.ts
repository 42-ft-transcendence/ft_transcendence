// this file populates some data.
// to do this, you need to register below code at package.json
// "prisma" : {
//   "seed": "ts-node ./prisma/seed.ts"
// }
// and use command "npx prisma db seed"
import { ChannelType, MapType, MatchType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateUniqueRandomStrings } from './seed-tool';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
	const userCount = 500;
	const channelCount = 200;

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
			length: userCount,
		}).map((_, i) => ({
			nickname: userNicknames.at(i),
			fourtyTwoId: faker.number.int({ min: 1, max: 100000 }), //TODO:
			avatar: userAvatars.at(i),
		})),
		skipDuplicates: true,
	});

	const userIds = (await prisma.user.findMany()).map((user) => user.id);

	// create channels
	await prisma.channel.createMany({
		data: Array.from({
			length: channelCount,
		}).map((_, i) => ({
			name: channelNames.at(i),
			type: faker.helpers.enumValue(ChannelType),
			ownerId: faker.helpers.arrayElement(userIds),
		})),
		skipDuplicates: true,
	});

	const protectedChannelIds = (
		await prisma.channel.findMany({
			where: {
				AND: [{ type: ChannelType.PROTECTED }, { password: undefined }],
			},
		})
	).map((channel) => channel.id);

	// create passwords for protected channels
	await prisma.channelPassword.createMany({
		data: Array.from({
			length: protectedChannelIds.length,
		}).map((_, i) => ({
			channelId: protectedChannelIds.at(i),
			password: bcrypt.hashSync(
				faker.internet.password(),
				bcrypt.genSaltSync(),
			),
		})),
		skipDuplicates: true,
	});

	const channelIds = await prisma.channel.findMany({
		select: {
			id: true,
			ownerId: true,
		},
	});

	const oneToOneChannelIds = await prisma.channel.findMany({
		where: { type: ChannelType.ONETOONE },
		select: {
			id: true,
			ownerId: true,
		},
	});

	const otherChannelIds = await prisma.channel.findMany({
		where: {
			NOT: [{ type: ChannelType.ONETOONE }],
		},
		select: {
			id: true,
			ownerId: true,
		},
	});

	//TODO: 채널 소유자를 participant나 administrator 테이블에 저장할 지 아니면 쿼리를 이용할 지 고민해보기.
	// create participants
	oneToOneChannelIds.map(async (channel) => {
		await prisma.participant.createMany({
			data: [
				{ channelId: channel.id, userId: channel.ownerId },
				{
					channelId: channel.id,
					userId: faker.helpers.arrayElement(
						userIds.filter((userId) => userId != channel.ownerId),
					),
				},
			],
			skipDuplicates: true,
		});
	});

	otherChannelIds.map(async (channel) => {
		const data = Array.from({
			length: faker.number.int({ min: 2, max: 100 }),
		}).map(() => ({
			channelId: channel.id,
			userId: faker.helpers.arrayElement(
				userIds.filter((p) => p !== channel.ownerId),
			),
		}));

		data.push({ channelId: channel.id, userId: channel.ownerId });

		await prisma.participant.createMany({
			data: data,
			skipDuplicates: true,
		});
	});

	// create administrators
	otherChannelIds.map(async (channel) => {
		const participantIds = (
			await prisma.participant.findMany({
				where: { channelId: channel.id },
			})
		).map((result) => result.userId);

		const administrators = Array.from({
			length: faker.number.int({
				min: 0,
				max: participantIds.length > 5 ? 5 : participantIds.length,
			}),
		}).map(() => ({
			channelId: channel.id,
			userId: faker.helpers.arrayElement(participantIds),
		}));

		administrators.push({ channelId: channel.id, userId: channel.ownerId });

		await prisma.administrator.createMany({
			data: administrators,
			skipDuplicates: true,
		});
	});

	// create messages
	// 같은 결과지만 userIds.map(...)과 같은 방식으로 쿼리를 실행하면 훨씬 오래 걸린다.
	// 사용자 수가 채널 수보다 훨씬 많기 때문에, 쿼리를 훨씬 많이 던지기 때문이다.
	channelIds.map(async (channel) => {
		const channelParticipants = await prisma.participant.findMany({
			where: { channelId: channel.id },
			select: { userId: true },
		});

		if (channelParticipants.length > 0) {
			const messages = Array.from({
				length: faker.number.int({
					min: channelParticipants.length * 3,
					max: 1000,
				}),
			}).map(() => ({
				content: faker.lorem.sentences({ min: 1, max: 5 }),
				channelId: channel.id,
				senderId: faker.helpers.arrayElement(channelParticipants).userId,
			}));

			await prisma.message.createMany({
				data: messages,
				skipDuplicates: true,
			});
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
		data: matches,
		skipDuplicates: true,
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
		data: followes,
		skipDuplicates: true,
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
		data: blocks,
		skipDuplicates: true,
	});

	const bans = Array.from({ length: 100 }).map(() => {
		const channel = faker.helpers.arrayElement(otherChannelIds);
		const user = faker.helpers.arrayElement(userIds);

		return {
			channelId: channel.id,
			userId: user,
		};
	});

	// create bans
	await prisma.ban.createMany({
		data: bans,
		skipDuplicates: true,
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
