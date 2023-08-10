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
import { BlocksService } from './blocks.service';
import { CreateBlockDto, UpdateBlockDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { BlockEntity } from './entities';

@Controller('blocks')
@ApiTags('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @ApiCreatedResponse({ type: BlockEntity })
  async create(@Body() createBlockDto: CreateBlockDto) {
    return await this.blocksService.create(createBlockDto);
  }

  @Get()
  @ApiOkResponse({ type: BlockEntity, isArray: true })
  async findAll() {
    return await this.blocksService.findAll();
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

  @Delete(':id')
  @ApiOkResponse({ type: BlockEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.blocksService.remove(id);
  }
}
