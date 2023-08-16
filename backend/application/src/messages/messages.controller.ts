import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { MessageEntity } from './entities';
import { ParsePositiveIntPipe } from 'src/common';
import { JwtAuthGuard } from 'src/auth';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: MessageEntity })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  async findAll() {
    return await this.messagesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: MessageEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.messagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: MessageEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: MessageEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.messagesService.remove(id);
  }
}
