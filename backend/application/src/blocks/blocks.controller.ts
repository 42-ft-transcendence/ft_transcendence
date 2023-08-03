import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto, UpdateBlockDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('blocks')
@ApiTags('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  async create(@Body() createBlockDto: CreateBlockDto) {
    return await this.blocksService.create(createBlockDto);
  }

  @Get()
  async findAll() {
    return await this.blocksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.blocksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    return await this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.blocksService.remove(id);
  }
}
