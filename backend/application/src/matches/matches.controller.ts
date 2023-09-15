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
import { MatchesService } from './matches.service';
import { ParsePositiveIntPipe } from 'src/common';
import { CreateMatchDto, UpdateMatchDto } from './dto';
import { MatchEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';

@Controller('matches')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('matches')
export class MatchesController {
	constructor(private readonly matchesService: MatchesService) {}

	@Post()
	@ApiCreatedResponse({ type: MatchEntity })
	async create(@Body() createMatchDto: CreateMatchDto) {
		return await this.matchesService.create(createMatchDto);
	}

	@Get()
	@ApiOkResponse({ type: MatchEntity, isArray: true })
	async findAll() {
		return await this.matchesService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: MatchEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.matchesService.findOne(id);
	}

	@Patch(':id')
	@ApiCreatedResponse({ type: MatchEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateMatchDto: UpdateMatchDto,
	) {
		return await this.matchesService.update(id, updateMatchDto);
	}

	@Delete(':id')
	@ApiOkResponse({ type: MatchEntity })
	async remove(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.matchesService.remove(id);
	}
}
