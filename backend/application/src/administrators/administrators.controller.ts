import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto, UpdateAdministratorDto } from './dto';
import { ParsePositiveIntPipe, PrismaClientExceptionFilter } from 'src/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('administrators')
@UseFilters(PrismaClientExceptionFilter)
@ApiTags('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Post()
  async create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return await this.administratorsService.create(createAdministratorDto);
  }

  @Get()
  async findAll() {
    return await this.administratorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.administratorsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    return await this.administratorsService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.administratorsService.remove(id);
  }
}
