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
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto, UpdateAdministratorDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { AdministratorEntity } from './entities';
import { JwtAuthGuard } from 'src/auth';

@Controller('administrators')
@ApiTags('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: AdministratorEntity })
  async create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return await this.administratorsService.create(createAdministratorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AdministratorEntity, isArray: true })
  async findAll() {
    return await this.administratorsService.findAll();
  }

  @Delete('/channelId/:channelId/userId/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AdministratorEntity })
  async removeOne(
    @Param('channelId', ParsePositiveIntPipe) channelId: number,
    @Param('userId', ParsePositiveIntPipe) userId: number,
  ) {
    return await this.administratorsService.removeOne(channelId, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AdministratorEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.administratorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: AdministratorEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    return await this.administratorsService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AdministratorEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.administratorsService.remove(id);
  }
}
