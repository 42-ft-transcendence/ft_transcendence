import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto, UpdateAdministratorDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { AdministratorEntity } from './entities';

@Controller('administrators')
@ApiTags('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Post()
  @ApiCreatedResponse({ type: AdministratorEntity })
  async create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return await this.administratorsService.create(createAdministratorDto);
  }

  @Get()
  @ApiOkResponse({ type: AdministratorEntity, isArray: true })
  async findAll() {
    return await this.administratorsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: AdministratorEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.administratorsService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: AdministratorEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    return await this.administratorsService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AdministratorEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.administratorsService.remove(id);
  }
}
