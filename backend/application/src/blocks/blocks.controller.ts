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
import { BlocksService } from './blocks.service';
import { CreateBlockDto, UpdateBlockDto } from './dto';
import {
	CurrentUser,
	ParsePositiveIntPipe,
	UserPropertyString,
} from 'src/common';
import { BlockEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';

@Controller('blocks')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('blocks')
export class BlocksController {
	constructor(private readonly blocksService: BlocksService) {}

	@Post()
	@ApiCreatedResponse({ type: BlockEntity })
	async create(
		@CurrentUser(UserPropertyString.ID) id: number,
		@Body() createBlockDto: CreateBlockDto,
	) {
		return await this.blocksService.create(id, createBlockDto.blockeeId);
	}

	@Get()
	@ApiOkResponse({ type: BlockEntity, isArray: true })
	async findAll(@CurrentUser(UserPropertyString.ID) id: number) {
		return await this.blocksService.findAll(id);
	}

	@Get(':id')
	@ApiOkResponse({ type: BlockEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.blocksService.findOne(id);
	}

	@Patch(':id')
	@ApiCreatedResponse({ type: BlockEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateBlockDto: UpdateBlockDto,
	) {
		return await this.blocksService.update(id, updateBlockDto);
	}

	@Delete(':blockeeId')
	@ApiOkResponse({ type: BlockEntity })
	async remove(
		@CurrentUser(UserPropertyString.ID) blockerId: number,
		@Param('blockeeId', ParsePositiveIntPipe) blockeeId: number,
	) {
		return await this.blocksService.remove(blockerId, blockeeId);
	}
}
