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
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import {
	CheckBanGuard,
	CheckPasswordGuard,
	CheckTargetInGuard,
	CurrentUser,
	ParsePositiveIntPipe,
	TargetRoleGuard,
	UserPropertyString,
} from 'src/common';
import { ParticipantEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';

@Controller('participants')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('participants')
export class ParticipantsController {
	constructor(private readonly participantsService: ParticipantsService) {}

	@Post()
	@UseGuards(CheckBanGuard, CheckPasswordGuard)
	@ApiCreatedResponse({ type: ParticipantEntity })
	async create(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Body() createParticipantDto: CreateParticipantDto,
	) {
		return await this.participantsService.create(userId, createParticipantDto);
	}

	@Get()
	@ApiOkResponse({ type: ParticipantEntity, isArray: true })
	async findAll() {
		return await this.participantsService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: ParticipantEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.participantsService.findOne(id);
	}

	@Patch(':id')
	@ApiCreatedResponse({ type: ParticipantEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateParticipantDto: UpdateParticipantDto,
	) {
		return await this.participantsService.update(id, updateParticipantDto);
	}

	@Delete('channelId/:channelId')
	@ApiOkResponse({ type: ParticipantEntity })
	async exit(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.participantsService.exit(userId, channelId);
	}

	@Delete('directChannelId/:channelId')
	@ApiOkResponse({ type: ParticipantEntity })
	async exitDirect(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.participantsService.exitDirect(userId, channelId);
	}

	@Delete('userId/:userId/channelId/:channelId')
	@UseGuards(TargetRoleGuard, CheckTargetInGuard)
	@ApiOkResponse({ type: ParticipantEntity })
	async remove(
		@Param('userId', ParsePositiveIntPipe) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.participantsService.remove(userId, channelId);
	}
}
