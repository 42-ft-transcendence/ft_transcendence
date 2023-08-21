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
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import {
  AddUserIdToBodyInterceptor,
  ParsePositiveIntPipe,
  ProcessChannelTypePipe,
  UserPropertyString,
} from 'src/common';
import { ChannelEntity } from './entities';
import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './dto';
import { JwtAuthGuard } from 'src/auth';
import { CurrentUser } from 'src/common/decorator';
import { QueryNameChannelDto } from './dto/query-name-channel.dto';

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
  @UsePipes(ProcessChannelTypePipe)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async findAll(@Query() queryChannelDto: QueryChannelDto) {
    return await this.channelsService.findAll(queryChannelDto);
  }

  //TODO: 정리하기. 루트 파라미터를 사용하지 않는 루트 핸들러는 이를 사용하는 루트 핸들러보다 위에 있어야 한다. 그렇지 않으면 루트 파라미터로 해석해버린다.
  @Get('name')
  @UsePipes(ProcessChannelTypePipe)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async findAllWithName(@Query() queryNameChannelDto: QueryNameChannelDto) {
    return await this.channelsService.findAllWithName(queryNameChannelDto);
  }

  @Get('ofCurrentUser')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChannelEntity })
  async findAllUserIn(@CurrentUser(UserPropertyString.ID) id: number) {
    return await this.channelsService.findAllUserIn(id);
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
