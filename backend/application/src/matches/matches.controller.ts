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
import { ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { ParsePositiveIntPipe, PrismaClientExceptionFilter } from 'src/common';
import { CreateMatchDto, UpdateMatchDto } from './dto';

@Controller('matches')
@UseFilters(PrismaClientExceptionFilter)
@ApiTags('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    return await this.matchesService.create(createMatchDto);
  }

  @Get()
  async findAll() {
    return await this.matchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.matchesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return await this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.matchesService.remove(id);
  }
}
