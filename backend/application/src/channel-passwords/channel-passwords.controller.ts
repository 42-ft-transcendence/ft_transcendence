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
import { ChannelPasswordsService } from './channel-passwords.service';
import { CreateChannelPasswordDto, UpdateChannelPasswordDto } from './dto';
import { ParsePositiveIntPipe, PrismaClientExceptionFilter } from 'src/common';
import { ChannelPasswordEntity } from './entities';

@Controller('channel-passwords')
@UseFilters(PrismaClientExceptionFilter)
@ApiTags('channel-passwords')
export class ChannelPasswordsController {
  constructor(
    private readonly channelPasswordsService: ChannelPasswordsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ChannelPasswordEntity })
  create(@Body() createChannelPasswordDto: CreateChannelPasswordDto) {
    return this.channelPasswordsService.create(createChannelPasswordDto);
  }

  @Get()
  @ApiCreatedResponse({ type: ChannelPasswordEntity, isArray: true })
  findAll() {
    return this.channelPasswordsService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ChannelPasswordEntity })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.channelPasswordsService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ChannelPasswordEntity })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateChannelPasswordDto: UpdateChannelPasswordDto,
  ) {
    return this.channelPasswordsService.update(id, updateChannelPasswordDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: ChannelPasswordEntity })
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.channelPasswordsService.remove(id);
  }
}
