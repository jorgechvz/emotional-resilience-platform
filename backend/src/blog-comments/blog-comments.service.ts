import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BlogComment, Prisma, User as PrismaUser } from '@prisma/client';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';

@Injectable()
export class BlogCommentsService {
  constructor(private prisma: PrismaService) {}

  private getCommonInclude() {
    return {
      user: { select: { id: true, firstName: true, lastName: true } },
    };
  }

  async create(
    userId: string,
    blogPostId: string,
    createBlogCommentDto: CreateBlogCommentDto,
  ): Promise<BlogComment> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const blogPost = await this.prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });
    if (!blogPost) {
      throw new NotFoundException(
        `Blog post with ID "${blogPostId}" not found`,
      );
    }

    const authorName =
      createBlogCommentDto.author ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      'Anonymous';

    return this.prisma.blogComment.create({
      data: {
        content: createBlogCommentDto.content,
        author: authorName,
        userId,
        blogPostId,
      },
      include: this.getCommonInclude(),
    });
  }

  async findAllByPost(
    blogPostId: string,
    params: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.BlogCommentOrderByWithRelationInput;
    },
  ): Promise<BlogComment[]> {
    const { skip, take, orderBy } = params;
    return this.prisma.blogComment.findMany({
      where: { blogPostId },
      skip,
      take,
      orderBy: orderBy || { createdAt: 'asc' },
      include: this.getCommonInclude(),
    });
  }

  async findOne(id: string): Promise<BlogComment | null> {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id },
      include: this.getCommonInclude(),
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return comment;
  }

  async update(
    id: string,
    userId: string,
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<BlogComment> {
    const comment = await this.prisma.blogComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    if (comment.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You do not have permission to update this comment.',
        );
      }
    }
    return this.prisma.blogComment.update({
      where: { id },
      data: updateBlogCommentDto,
      include: this.getCommonInclude(),
    });
  }

  async remove(id: string, userId: string): Promise<BlogComment> {
    const comment = await this.prisma.blogComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    if (comment.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You do not have permission to delete this comment.',
        );
      }
    }
    return this.prisma.blogComment.delete({
      where: { id },
    });
  }

  async likeComment(id: string): Promise<BlogComment> {
    const comment = await this.prisma.blogComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return this.prisma.blogComment.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
      include: this.getCommonInclude(),
    });
  }
}
