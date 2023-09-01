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
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import { ParsePositiveIntPipe, UserPropertyString } from 'src/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ParticipantEntity } from './entities';
import { JwtAuthGuard } from 'src/auth';
import { CurrentUser } from 'src/common/decorator';
import { CheckBanGuard } from 'src/common/guard/check-ban/check-ban.guard';

@Controller('participants')
@ApiTags('participants')
export class ParticipantsController {
	constructor(private readonly participantsService: ParticipantsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, CheckBanGuard)
	@ApiCreatedResponse({ type: ParticipantEntity })
	async create(
		@CurrentUser(UserPropertyString.ID) userId: number,
		@Body() createParticipantDto: CreateParticipantDto,
	) {
		return await this.participantsService.create(userId, createParticipantDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: ParticipantEntity, isArray: true })
	async findAll() {
		return await this.participantsService.findAll();
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: ParticipantEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.participantsService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@ApiCreatedResponse({ type: ParticipantEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateParticipantDto: UpdateParticipantDto,
	) {
		return await this.participantsService.update(id, updateParticipantDto);
	}

	@Delete('userId/:userId/channelId/:channelId')
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: ParticipantEntity })
	async remove(
		@Param('userId', ParsePositiveIntPipe) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.participantsService.remove(userId, channelId);
	}
}
