import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';
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
import { BlogCommentEntity } from './entities/blog-comment.entity';

@ApiTags('Blog Comments')
@Controller()
export class BlogCommentsController {
  constructor(private readonly blogCommentsService: BlogCommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('blog-posts/:blogPostId/comments')
  @ApiOperation({ summary: 'Create a new comment for a blog post' })
  @ApiParam({
    name: 'blogPostId',
    description: 'ID of the blog post to comment on',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
    type: BlogCommentEntity,
  })
  async create(
    @GetUser('id') userId: string,
    @Param('blogPostId') blogPostId: string,
    @Body() createBlogCommentDto: CreateBlogCommentDto,
  ): Promise<BlogCommentEntity> {
    const comment = await this.blogCommentsService.create(
      userId,
      blogPostId,
      createBlogCommentDto,
    );
    return new BlogCommentEntity(comment as any);
  }

  @Get('blog-comments/:id')
  @ApiOperation({ summary: 'Get a specific comment by ID' })
  @ApiParam({ name: 'id', description: 'ID of the comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment details.',
    type: BlogCommentEntity,
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async findOne(@Param('id') id: string): Promise<BlogCommentEntity> {
    const comment = await this.blogCommentsService.findOne(id);
    return new BlogCommentEntity(comment as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('blog-comments/:id')
  @ApiOperation({ summary: 'Update a comment (owner or admin)' })
  @ApiParam({ name: 'id', description: 'ID of the comment to update' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully.',
    type: BlogCommentEntity,
  })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<BlogCommentEntity> {
    const comment = await this.blogCommentsService.update(
      id,
      userId,
      updateBlogCommentDto,
    );
    return new BlogCommentEntity(comment as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('blog-comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment (owner or admin)' })
  @ApiParam({ name: 'id', description: 'ID of the comment to delete' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully.' })
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<void> {
    await this.blogCommentsService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('blog-comments/:id/like')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({ name: 'id', description: 'ID of the comment to like' })
  @ApiResponse({
    status: 200,
    description: 'Comment liked successfully.',
    type: BlogCommentEntity,
  })
  async likeComment(@Param('id') id: string): Promise<BlogCommentEntity> {
    const comment = await this.blogCommentsService.likeComment(id);
    return new BlogCommentEntity(comment as any);
  }
}
