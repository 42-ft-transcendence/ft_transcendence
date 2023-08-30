import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
	UseInterceptors,
	UploadedFile,
	ParseFilePipeBuilder,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
	ChannelAdminGuard,
	ParsePositiveIntPipe,
	TargetRoleGuard,
	UserPropertyString,
} from 'src/common';
import { JwtAuthGuard } from 'src/auth';
import { CurrentUser } from 'src/common/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiCreatedResponse({ type: UserEntity }) //TODO: ApiCreatedResponse는 생성(Post method)에 성공했을 때를 나타내는 것이다. 다음 링크를 참고해서 수정하자. 모든 컨트롤러를 다 수정하자. https://docs.nestjs.com/openapi/operations
	async create(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: UserEntity, isArray: true })
	async findAll(@CurrentUser(UserPropertyString.ID) id: number) {
		return await this.usersService.findAll(id);
	}

	@Get('name')
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: UserEntity, isArray: true })
	async findByName(
		@CurrentUser(UserPropertyString.ID) id: number,
		@Query('name') name: string,
	) {
		return await this.usersService.findByName(id, name);
	}

	@Patch('update')
	@UseInterceptors(FileInterceptor('file'))
	@UseGuards(JwtAuthGuard)
	@ApiCreatedResponse({ type: UserEntity })
	async updateProfile(
		@CurrentUser(UserPropertyString.ID) id: number,
		@Body() updateUserProfileDto: UpdateUserProfileDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addMaxSizeValidator({ maxSize: 1000000 })
				.addFileTypeValidator({ fileType: 'image/jpeg' }) //TODO: 단순히 파일의 확장자를 확인할 뿐, 파일의 내용을 확인하진 않으므로 직접 magic number 등을 확인하게 구현해서 사용하자. 파일 타입도 image/png 등 추가하기
				.build(),
		)
		file: Express.Multer.File,
	) {
		return await this.usersService.update(id, {
			...updateUserProfileDto,
			avatar: file.path,
		});
	}

	@Patch('ban/userId/:userId/channelId/:channelId')
	@UseGuards(JwtAuthGuard, ChannelAdminGuard, TargetRoleGuard)
	@ApiOkResponse({ type: UserEntity })
	async ban(
		@Param('userId', ParsePositiveIntPipe) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.usersService.ban(userId, channelId);
	}

	@Patch('kick/userId/:userId/channelId/:channelId')
	@UseGuards(JwtAuthGuard, ChannelAdminGuard, TargetRoleGuard)
	@ApiOkResponse({ type: UserEntity })
	async kick(
		@Param('userId', ParsePositiveIntPipe) userId: number,
		@Param('channelId', ParsePositiveIntPipe) channelId: number,
	) {
		return await this.usersService.kick(userId, channelId);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: UserEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.usersService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@ApiCreatedResponse({ type: UserEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return await this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: UserEntity })
	async remove(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.usersService.remove(id);
	}
}
