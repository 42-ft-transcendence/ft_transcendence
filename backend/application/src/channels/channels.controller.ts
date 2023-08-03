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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { ParsePositiveIntPipe, PrismaClientExceptionFilter } from 'src/common';
import { ChannelEntity } from './entities';
import { CreateChannelDto, UpdateChannelDto } from './dto';

@Controller('channels')
@UseFilters(PrismaClientExceptionFilter)
@ApiTags('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiCreatedResponse({ type: ChannelEntity })
  async create(@Body() createChannelDto: CreateChannelDto) {
    return await this.channelsService.create(createChannelDto);
  }

  @Get()
  @ApiCreatedResponse({ type: ChannelEntity, isArray: true })
  async findAll() {
    return await this.channelsService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ChannelEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.channelsService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ChannelEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return await this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: ChannelEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.channelsService.remove(id);
  }
}
