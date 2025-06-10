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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { DiscussionRepliesService } from './discussions-replies.service';
import { DiscussionReplyEntity } from 'src/discussions/entities/discussion-reply.entity';
import { CreateDiscussionReplyDto } from './dto/create-discussions-reply.dto';
import { UpdateDiscussionReplyDto } from './dto/update-discussions-reply.dto';

@ApiTags('Discussion Replies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discussion-replies') 
export class DiscussionRepliesController {
  constructor(private readonly repliesService: DiscussionRepliesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reply (to a discussion or another reply)' })
  @ApiResponse({ status: 201, description: 'Reply created successfully.', type: DiscussionReplyEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (e.g., not enrolled).' })
  @ApiResponse({ status: 404, description: 'Discussion or Parent Reply not found.' })
  async create(
    @GetUser('id') userId: string,
    @Body() createReplyDto: CreateDiscussionReplyDto,
  ): Promise<DiscussionReplyEntity> {
    const reply = await this.repliesService.create(userId, createReplyDto);
    return new DiscussionReplyEntity(reply as any);
  }

  @Get(':replyId/children')
  @ApiOperation({ summary: 'Get child replies of a specific reply (for lazy loading)' })
  @ApiParam({ name: 'replyId', description: 'ID of the parent reply' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of child replies.', type: [DiscussionReplyEntity] })
  @ApiResponse({ status: 404, description: 'Parent reply not found.' })
  async findChildrenOfReply(
    @Param('replyId') replyId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<DiscussionReplyEntity[]> {
    const replies = await this.repliesService.findChildrenOfReply(replyId, { skip, take });
    return replies.map(r => new DiscussionReplyEntity(r as any));
  }
  
  @Get(':replyId')
  @ApiOperation({ summary: 'Get a specific reply by ID' })
  @ApiParam({ name: 'replyId', description: 'ID of the reply' })
  @ApiResponse({ status: 200, description: 'Reply details.', type: DiscussionReplyEntity })
  @ApiResponse({ status: 404, description: 'Reply not found.' })
  async findOne(@Param('replyId') replyId: string): Promise<DiscussionReplyEntity> {
    const reply = await this.repliesService.findOne(replyId);
    return new DiscussionReplyEntity(reply as any);
  }

  @Patch(':replyId')
  @ApiOperation({ summary: 'Update a reply (owner or admin only)' })
  @ApiParam({ name: 'replyId', description: 'ID of the reply to update' })
  @ApiResponse({ status: 200, description: 'Reply updated successfully.', type: DiscussionReplyEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Reply not found.' })
  async update(
    @GetUser('id') userId: string,
    @Param('replyId') replyId: string,
    @Body() updateReplyDto: UpdateDiscussionReplyDto,
  ): Promise<DiscussionReplyEntity> {
    const reply = await this.repliesService.update(replyId, userId, updateReplyDto);
    return new DiscussionReplyEntity(reply as any);
  }

  @Delete(':replyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reply (owner or admin only)' })
  @ApiParam({ name: 'replyId', description: 'ID of the reply to delete' })
  @ApiResponse({ status: 204, description: 'Reply deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (e.g. has child replies or not owner).' })
  @ApiResponse({ status: 404, description: 'Reply not found.' })
  async remove(
    @GetUser('id') userId: string,
    @GetUser() currentUser: PrismaUser, // Para obtener el rol
    @Param('replyId') replyId: string,
  ): Promise<void> {
    await this.repliesService.remove(replyId, userId);
  }
}