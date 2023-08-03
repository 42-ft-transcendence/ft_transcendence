import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ParticipantEntity } from './entities';

@Controller('participants')
@ApiTags('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiCreatedResponse({ type: ParticipantEntity })
  async create(@Body() createParticipantDto: CreateParticipantDto) {
    return await this.participantsService.create(createParticipantDto);
  }

  @Get()
  @ApiCreatedResponse({ type: ParticipantEntity, isArray: true })
  async findAll() {
    return await this.participantsService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ParticipantEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.participantsService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ParticipantEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return await this.participantsService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: ParticipantEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.participantsService.remove(id);
  }
}
