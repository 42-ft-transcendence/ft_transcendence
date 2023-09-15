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
import { FollowsService } from './follows.service';
import {
	CurrentUser,
	ParsePositiveIntPipe,
	UserPropertyString,
} from 'src/common';
import { CreateFollowDto, UpdateFollowDto } from './dto';
import { FollowEntity } from './entities';
import { JwtTwoFactorAuthGuard } from 'src/auth';

@Controller('follows')
@UseGuards(JwtTwoFactorAuthGuard)
@ApiTags('follows')
export class FollowsController {
	constructor(private readonly followsService: FollowsService) {}
	//TODO: 인증을 통해 현재 사용자의 User 테이블 id 값이 createFollowDto의 followerId와 같은지 확인하기. 아니다 애초에 일반 사용자는 해당 URL에 접근할 수 없게 하면 되네 -> JWT 사용자의 정보를 이용해서 해결
	//TODO: followerId와 followeeId가 서로 다른지 확인하기 -> check 제약조건 적용으로 해결
	//TODO: 데이터베이스 테이블에 이미 동일한 행이 존재하는지 먼저 확인하기 -> unique 제약조건 적용으로 해결
	@Post()
	@ApiCreatedResponse({ type: FollowEntity })
	async create(
		@CurrentUser(UserPropertyString.ID) id: number,
		@Body() createFollowDto: CreateFollowDto,
	) {
		return await this.followsService.create(id, createFollowDto);
	}

	@Get()
	@ApiOkResponse({ type: FollowEntity, isArray: true })
	async findAll(@CurrentUser(UserPropertyString.ID) id: number) {
		return await this.followsService.findAll(id);
	}

	@Get(':id')
	@ApiOkResponse({ type: FollowEntity })
	async findOne(@Param('id', ParsePositiveIntPipe) id: number) {
		return await this.followsService.findOne(id);
	}

	@Patch(':id')
	@ApiCreatedResponse({ type: FollowEntity })
	async update(
		@Param('id', ParsePositiveIntPipe) id: number,
		@Body() updateFollowDto: UpdateFollowDto,
	) {
		return await this.followsService.update(id, updateFollowDto);
	}

	@Delete(':followeeId')
	@ApiOkResponse({ type: FollowEntity })
	async remove(
		@CurrentUser(UserPropertyString.ID) followerId: number,
		@Param('followeeId', ParsePositiveIntPipe) followeeId: number,
	) {
		return await this.followsService.remove(followerId, followeeId);
	}
	//TODO: 인증을 통해 현재 사용자의 User 테이블 id 값이 createFollowDto의 followerId와 같은지 확인하기. 아니다 애초에 일반 사용자는 해당 URL에 접근할 수 없게 하면 되네
	//TODO: 관계를 가진 엔티티를 같이 로드해서 반환하게 구현하기
	//TODO: pagination 적용하기
	//TODO: 이 핸들러 쓰는지 확인하고 안쓰면 제거
	@Get(':followerId')
	@ApiCreatedResponse({ type: FollowEntity, isArray: true })
	async findMany(
		@Param('followerId', ParsePositiveIntPipe) followerId: number,
	) {
		return await this.followsService.findMany(followerId);
	}
	//TODO: 인증을 통해 현재 사용자의 User 테이블 id 값이 createFollowDto의 followerId와 같은지 확인하기. 아니다 애초에 일반 사용자는 해당 URL에 접근할 수 없게 하면 되네
	//TODO: followerId와 followeeId가 서로 다른지 확인하기
	//TODO: 이 핸들러 쓰는지 확인하고 안쓰면 제거
	@Delete('/:followerId/:followeeId')
	@ApiCreatedResponse({ type: FollowEntity })
	async removeByIds(
		@Param('followerId', ParsePositiveIntPipe) followerId: number,
		@Param('followeeId', ParsePositiveIntPipe) followeeId: number,
	) {
		return await this.followsService.removeByIds(followerId, followeeId);
	}

	//TODO: 여러 사용자를 체크 박스 등을 이용해서 전달받아 제거하는 기능을 구현할지 고민해보기
}
