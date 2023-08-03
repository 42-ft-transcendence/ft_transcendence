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
import { UsersService } from './users.service';
import { UserEntity } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ParsePositiveIntPipe, PrismaClientExceptionFilter } from 'src/common';

@Controller('users')
@UseFilters(PrismaClientExceptionFilter)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity }) //TODO: ApiCreatedResponse는 생성(Post method)에 성공했을 때를 나타내는 것이다. 다음 링크를 참고해서 수정하자. 모든 컨트롤러를 다 수정하자. https://docs.nestjs.com/openapi/operations
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
