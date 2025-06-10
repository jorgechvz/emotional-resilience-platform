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
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { DiscussionEntity } from './entities/discussion.entity';

@ApiTags('Discussions (Nested under Chapters)')
@Controller('courses/:courseId/chapters/:chapterId/discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new discussion in a chapter' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiResponse({
    status: 201,
    description: 'Discussion created successfully.',
    type: DiscussionEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (e.g., user not enrolled).',
  })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async create(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() createDiscussionDto: CreateDiscussionDto,
  ): Promise<DiscussionEntity> {
    const discussion = await this.discussionsService.create(
      userId,
      courseId,
      chapterId,
      createDiscussionDto,
    );
    return new DiscussionEntity(discussion);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discussions for a specific chapter' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Records to skip (pagination)',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Records to take (pagination)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'Field to order discussions by (e.g., createdAt)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of discussions.',
    type: [DiscussionEntity],
  })
  @ApiResponse({ status: 404, description: 'Chapter not found.' })
  async findAllByChapter(
    @Param('chapterId') chapterId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
    @Query('orderBy') orderBy?: string,
  ): Promise<DiscussionEntity[]> {
    const discussions = await this.discussionsService.findAllByChapter(
      chapterId,
      { skip, take, orderBy: orderBy ? { [orderBy]: 'desc' } : undefined },
    );
    return discussions.map((d) => new DiscussionEntity(d));
  }

  @Get(':discussionId')
  @ApiOperation({ summary: 'Get a specific discussion by ID' })
  @ApiParam({ name: 'courseId', description: 'ID of the course (context)' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter (context)' })
  @ApiParam({ name: 'discussionId', description: 'ID of the discussion' })
  @ApiResponse({
    status: 200,
    description: 'Discussion details.',
    type: DiscussionEntity,
  })
  @ApiResponse({ status: 404, description: 'Discussion not found.' })
  async findOne(
    @Param('discussionId') discussionId: string,
  ): Promise<DiscussionEntity> {
    const discussion = await this.discussionsService.findOne(discussionId);
    return new DiscussionEntity(discussion as any);
  }

  @Patch(':discussionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a discussion (owner or admin only)' })
  @ApiParam({ name: 'courseId', description: 'ID of the course (context)' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter (context)' })
  @ApiParam({
    name: 'discussionId',
    description: 'ID of the discussion to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Discussion updated successfully.',
    type: DiscussionEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (not owner or insufficient permissions).',
  })
  @ApiResponse({ status: 404, description: 'Discussion not found.' })
  async update(
    @GetUser('id') userId: string,
    @Param('discussionId') discussionId: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
  ): Promise<DiscussionEntity> {
    const discussion = await this.discussionsService.update(
      userId,
      discussionId,
      updateDiscussionDto,
    );
    return new DiscussionEntity(discussion as any);
  }

  @Delete(':discussionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a discussion (owner or admin only)' })
  @ApiParam({ name: 'courseId', description: 'ID of the course (context)' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter (context)' })
  @ApiParam({
    name: 'discussionId',
    description: 'ID of the discussion to delete',
  })
  @ApiResponse({ status: 204, description: 'Discussion deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (not owner or insufficient permissions).',
  })
  @ApiResponse({ status: 404, description: 'Discussion not found.' })
  async remove(
    @GetUser('id') userId: string,
    @Param('discussionId') discussionId: string,
  ): Promise<void> {
    await this.discussionsService.remove(userId, discussionId);
  }
}
