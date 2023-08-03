import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BansService } from './bans.service';
import { CreateBanDto, UpdateBanDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('bans')
@ApiTags('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Post()
  async create(@Body() createBanDto: CreateBanDto) {
    return await this.bansService.create(createBanDto);
  }

  @Get()
  async findAll() {
    return await this.bansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.bansService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateBanDto: UpdateBanDto,
  ) {
    return await this.bansService.update(id, updateBanDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.bansService.remove(id);
  }
}
