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
import { BansService } from './bans.service';
import { CreateBanDto, UpdateBanDto } from './dto';
import { ParsePositiveIntPipe } from 'src/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BanEntity } from './entities';
import { JwtAuthGuard } from 'src/auth';

@Controller('bans')
@ApiTags('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: BanEntity })
  async create(@Body() createBanDto: CreateBanDto) {
    return await this.bansService.create(createBanDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BanEntity, isArray: true })
  async findAll() {
    return await this.bansService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BanEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.bansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: BanEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateBanDto: UpdateBanDto,
  ) {
    return await this.bansService.update(id, updateBanDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BanEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.bansService.remove(id);
  }
}
