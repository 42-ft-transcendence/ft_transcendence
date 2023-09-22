import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	UseInterceptors,
	Query,
	UsePipes,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import {
	AddUserIdToBodyInterceptor,
	CheckBlockGuard,
	CheckUserInGuard,
	CurrentUser,
	HashPasswordPipe,
	ParsePositiveIntPipe,
	ProcessChannelTypePipe,
	UserPropertyString,
} from 'src/common';
import { ChannelEntity } from './entities';
import {
	CreateChannelDto,
	CreateDirectChannelDto,
	QueryChannelDto,
	QueryNameChannelDto,
	UpdateChannelDto,
} from './dto';
import { JwtTwoFactorAuthGuard } from 'src/auth';
import { User } from '@prisma/client';

@Controller('channels')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post()
	// @UseInterceptors(new AddUserIdToBodyInterceptor('ownerId')) //TODO: @CurrentUser 데코레이터로 교체할까?
	@ApiCreatedResponse({ type: ChannelEntity })
	async create(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Body(HashPasswordPipe) createChannelDto: CreateChannelDto,
	) {
		return await this.channelsService.create(userId, createChannelDto);
	}

	@Post('directChannel')
	// @UseInterceptors(new AddUserIdToBodyIntersceptor('ownerId'))
	@UseGuards(CheckBlockGuard)
	@ApiCreatedResponse({ type: ChannelEntity })
	async findOrCreateDirectChannel(
		@CurrentUser(UserPropertyString.ID) ownerId: number,
		@CurrentUser(UserPropertyString.NICKNAME) userName: string,
		@Body() createDirectChannelDto: CreateDirectChannelDto,
	) {
		return await this.channelsService.findOrCreateDirectChannel(
			ownerId,
			userName,
			createDirectChannelDto,
		);
	}

	@Get()
	@UsePipes(ProcessChannelTypePipe)
	@ApiOkResponse({ type: ChannelEntity, isArray: true })
	async findAll(@Query() queryChannelDto: QueryChannelDto) {
		return await this.channelsService.findAll(queryChannelDto);
	}

	//TODO: 정리하기. 루트 파라미터를 사용하지 않는 루트 핸들러는 이를 사용하는 루트 핸들러보다 위에 있어야 한다. 그렇지 않으면 루트 파라미터로 해석해버린다.
	@Get('name')
	@UsePipes(ProcessChannelTypePipe)
	@ApiOkResponse({ type: ChannelEntity, isArray: true })
	async findAllWithName(@Query() queryNameChannelDto: QueryNameChannelDto) {
		return await this.channelsService.findAllWithName(queryNameChannelDto);
	}

	@Get('channelsUserIn')
	@ApiOkResponse({ type: ChannelEntity })
	async findChannelsUserIn(@CurrentUser(UserPropertyString.ID) id: number) {
		return await this.channelsService.findChannelsUserIn(id);
	}

	@Get('directsUserIn')
	@ApiOkResponse({ type: ChannelEntity })
	async findDirectsUserIn(@CurrentUser(UserPropertyString.ID) id: number) {
		return await this.channelsService.findDirectsUserIn(id);
	}

	@Get(':id')
	@ApiOkResponse({ type: ChannelEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.channelsService.findOne(id);
	}

	@Get(':channelId/detail')
	@UseGuards(CheckUserInGuard)
	@ApiOkResponse({ type: ChannelEntity })
	async findOneInDetail(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.channelsService.findOneInDetail(userId, channelId);
	}

	@Get(':channelId/contents')
	@UseGuards(CheckUserInGuard)
	@ApiOkResponse({ type: ChannelEntity })
	async findContents(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.channelsService.findContents(userId, channelId);
	}

	// @Patch(':id')
	// @ApiCreatedResponse({ type: ChannelEntity })
	// async update(
	// 	@Param('id', ParsePositiveIntPipe) id: number,
	// 	@Body() updateChannelDto: UpdateChannelDto,
	// ) {
	// 	return await this.channelsService.update(id, updateChannelDto);
	// }

	@Delete(':id')
	@ApiOkResponse({ type: ChannelEntity })
	async remove(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.channelsService.remove(id);
	}
}
