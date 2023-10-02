import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BansService } from './bans.service';
import { CreateBanDto, UpdateBanDto } from './dto';
import {
	ChannelAdminGuard,
	CheckTargetInGuard,
	ParsePositiveIntPipe,
	TargetRoleGuard,
} from 'src/common';
import { BanEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';
import { CheckUnbanGuard } from 'src/common/guard/check-unban/check-unban.guard';

@Controller('bans')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('bans')
export class BansController {
	constructor(private readonly bansService: BansService) {}

	@Post()
	@UseGuards(ChannelAdminGuard, TargetRoleGuard, CheckTargetInGuard)
	@ApiCreatedResponse({ type: BanEntity })
	async create(@Body() createBanDto: CreateBanDto) {
		return await this.bansService.create(createBanDto);
	}

	@Get()
	@ApiOkResponse({ type: BanEntity, isArray: true })
	async findAll() {
		return await this.bansService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: BanEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.bansService.findOne(id);
	}

	@Patch(':id')
	@ApiCreatedResponse({ type: BanEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateBanDto: UpdateBanDto,
	) {
		return await this.bansService.update(id, updateBanDto);
	}

	@Delete('userId/:userId/channelId/:channelId')
	@UseGuards(ChannelAdminGuard, CheckUnbanGuard)
	@ApiOkResponse({ type: BanEntity })
	async remove(
		@Param('userId', ParsePositiveIntPipe) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.bansService.remove(userId, channelId);
	}
}
