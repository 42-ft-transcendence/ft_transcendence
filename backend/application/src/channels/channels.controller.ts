import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { AddUserIdToBodyInterceptor, ParsePositiveIntPipe } from 'src/common';
import { ChannelEntity } from './entities';
import { CreateChannelDto, UpdateChannelDto } from './dto';
import { JwtAuthGuard } from 'src/auth';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @UseInterceptors(new AddUserIdToBodyInterceptor('ownerId'))
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: ChannelEntity })
  async create(@Body() createChannelDto: CreateChannelDto) {
    return await this.channelsService.create(createChannelDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async findAll() {
    return await this.channelsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.channelsService.findOne(id);
  }

  @Get(':id/detail')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity })
  async findOneInDetail(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.channelsService.findOneInDetail(id);
  }

  @Get(':id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity })
  async findParticipantsById(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.channelsService.findParticipantsById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: ChannelEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return await this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.channelsService.remove(id);
  }
}
