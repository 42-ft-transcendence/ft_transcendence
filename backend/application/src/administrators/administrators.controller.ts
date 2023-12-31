import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto';
import {
	ChannelOwnerGuard,
	CheckTargetInGuard,
	ParsePositiveIntPipe,
} from 'src/common';
import { AdministratorEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';
import { CheckTargetAdminGuard } from 'src/common/guard/check-target-admin/check-target-admin.guard';
import { CheckTargetOwnerGuard } from 'src/common/guard/check-target-owner/check-target-owner.guard';

@Controller('administrators')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('administrators')
export class AdministratorsController {
	constructor(private readonly administratorsService: AdministratorsService) {}

	@Post()
	@UseGuards(CheckTargetInGuard, ChannelOwnerGuard)
	@ApiCreatedResponse({ type: AdministratorEntity })
	async create(@Body() createAdministratorDto: CreateAdministratorDto) {
		return await this.administratorsService.create(createAdministratorDto);
	}

	@Get()
	@ApiOkResponse({ type: AdministratorEntity, isArray: true })
	async findAll() {
		return await this.administratorsService.findAll();
	}

	@Delete('/channelId/:channelId/userId/:userId')
	@UseGuards(CheckTargetAdminGuard, CheckTargetOwnerGuard, ChannelOwnerGuard)
	@ApiOkResponse({ type: AdministratorEntity })
	async removeOne(
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
		@Param('userId', ParsePositiveIntPipe) userId: number,
	) {
		return await this.administratorsService.removeOne(channelId, userId);
	}

	@Get(':id')
	@ApiOkResponse({ type: AdministratorEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.administratorsService.findOne(id);
	}

	// @Patch(':id')
	// @UseGuards(JwtAuthGuard)
	// @ApiCreatedResponse({ type: AdministratorEntity })
	// async update(
	//   @Param('id', ParsePositiveIntPipe) id: number,
	//   @Body() updateAdministratorDto: UpdateAdministratorDto,
	// ) {
	//   return await this.administratorsService.update(id, updateAdministratorDto);
	// }

	// @Delete(':id')
	// @UseGuards(JwtAuthGuard)
	// @ApiOkResponse({ type: AdministratorEntity })
	// async remove(@Param('id', ParsePositiveIntPipe) id: number) {
	//   return await this.administratorsService.remove(id);
	// }
}
