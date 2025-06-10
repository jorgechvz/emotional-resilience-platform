import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { BlogPostEntity } from './entities/blog-post.entity';
import { BlogCommentsService } from '../blog-comments/blog-comments.service';
import { BlogCommentEntity } from '../blog-comments/entities/blog-comment.entity';

@ApiTags('Blog Posts')
@Controller('blog-posts')
export class BlogPostsController {
  constructor(
    private readonly blogPostsService: BlogPostsService,
    private readonly blogCommentsService: BlogCommentsService, 
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully.',
    type: BlogPostEntity,
  })
  async create(
    @GetUser('id') userId: string,
    @Body() createBlogPostDto: CreateBlogPostDto,
  ): Promise<BlogPostEntity> {
    const post = await this.blogPostsService.create(userId, createBlogPostDto);
    return new BlogPostEntity(post as any);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts with pagination' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of records to take',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'e.g., createdAt_asc or title_desc',
  })
  @ApiResponse({
    status: 200,
    description: 'List of blog posts.',
    type: [BlogPostEntity],
  })
  async findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
    @Query('orderBy') orderBy?: string,
  ): Promise<BlogPostEntity[]> {
    let orderByCondition;
    if (orderBy) {
      const [field, direction] = orderBy.split('_');
      orderByCondition = { [field]: direction };
    }
    const posts = await this.blogPostsService.findAll({
      skip,
      take,
      orderBy: orderByCondition,
    });
    return posts.map((post) => new BlogPostEntity(post as any));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', description: 'ID of the blog post' })
  @ApiResponse({
    status: 200,
    description: 'Blog post details.',
    type: BlogPostEntity,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async findOne(@Param('id') id: string): Promise<BlogPostEntity> {
    const post = await this.blogPostsService.findOne(id);
    return new BlogPostEntity(post as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog post (owner or admin)' })
  @ApiParam({ name: 'id', description: 'ID of the blog post to update' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully.',
    type: BlogPostEntity,
  })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPostEntity> {
    const post = await this.blogPostsService.update(
      id,
      userId,
      updateBlogPostDto,
    );
    return new BlogPostEntity(post as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blog post (owner or admin)' })
  @ApiParam({ name: 'id', description: 'ID of the blog post to delete' })
  @ApiResponse({ status: 204, description: 'Blog post deleted successfully.' })
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<void> {
    await this.blogPostsService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard) // Opcional, podría ser público
  @ApiBearerAuth() // Si es con guard
  @Post(':id/like')
  @ApiOperation({ summary: 'Like a blog post' })
  @ApiParam({ name: 'id', description: 'ID of the blog post to like' })
  @ApiResponse({
    status: 200,
    description: 'Blog post liked successfully.',
    type: BlogPostEntity,
  })
  async likePost(@Param('id') id: string): Promise<BlogPostEntity> {
    const post = await this.blogPostsService.likePost(id);
    return new BlogPostEntity(post as any);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a blog post' })
  @ApiParam({ name: 'id', description: 'ID of the blog post' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of comments.',
    type: [BlogCommentEntity],
  })
  async getCommentsForPost(
    @Param('id') postId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<BlogCommentEntity[]> {
    await this.blogPostsService.findOne(postId);
    const comments = await this.blogCommentsService.findAllByPost(postId, {
      skip,
      take,
    });
    return comments.map((comment) => new BlogCommentEntity(comment as any));
  }
}
