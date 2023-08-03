import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { MessageEntity } from './entities';
import { ParsePositiveIntPipe } from 'src/common';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiCreatedResponse({ type: MessageEntity })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }

  @Get()
  @ApiCreatedResponse({ type: MessageEntity, isArray: true })
  async findAll() {
    return await this.messagesService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: MessageEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: MessageEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: MessageEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.messagesService.remove(id);
  }
}
