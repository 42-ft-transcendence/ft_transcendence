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
import { ChannelPasswordsService } from './channel-passwords.service';
import { CreateChannelPasswordDto, UpdateChannelPasswordDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { ChannelPasswordEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';

@Controller('channel-passwords')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('channel-passwords')
export class ChannelPasswordsController {
	constructor(
		private readonly channelPasswordsService: ChannelPasswordsService,
	) {}

	@Post()
	@ApiCreatedResponse({ type: ChannelPasswordEntity })
	async create(@Body() createChannelPasswordDto: CreateChannelPasswordDto) {
		return new ChannelPasswordEntity(
			await this.channelPasswordsService.create(createChannelPasswordDto),
		);
	}

	@Get()
	@ApiOkResponse({ type: ChannelPasswordEntity, isArray: true })
	async findAll() {
		const passwords = await this.channelPasswordsService.findAll();
		return passwords.map((pw) => new ChannelPasswordEntity(pw));
	}

	@Get(':id')
	@ApiOkResponse({ type: ChannelPasswordEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return new ChannelPasswordEntity(
			await this.channelPasswordsService.findOne(id),
		);
	}

	@Patch(':id')
	@ApiCreatedResponse({ type: ChannelPasswordEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateChannelPasswordDto: UpdateChannelPasswordDto,
	) {
		return new ChannelPasswordEntity(
			await this.channelPasswordsService.update(id, updateChannelPasswordDto),
		);
	}

	@Delete(':id')
	@ApiOkResponse({ type: ChannelPasswordEntity })
	async remove(@Param('id', ParsePositiveIntPipe) id: number) {
		return new ChannelPasswordEntity(
			await this.channelPasswordsService.remove(id),
		);
	}
}
