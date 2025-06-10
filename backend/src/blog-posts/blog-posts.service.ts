import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BlogPost, Prisma } from '@prisma/client';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(private prisma: PrismaService) {}

  private getCommonInclude() {
    return {
      user: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { comments: true } },
    };
  }

  async create(
    userId: string,
    createBlogPostDto: CreateBlogPostDto,
  ): Promise<BlogPost> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.blogPost.create({
      data: {
        ...createBlogPostDto,
        userId,
      },
      include: this.getCommonInclude(),
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BlogPostWhereUniqueInput;
    where?: Prisma.BlogPostWhereInput;
    orderBy?: Prisma.BlogPostOrderByWithRelationInput;
  }): Promise<BlogPost[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.blogPost.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        _count: { select: { comments: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findOne(id: string): Promise<BlogPost | null> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        ...this.getCommonInclude(),
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException(`Blog post with ID "${id}" not found`);
    }
    return post;
  }

  async update(
    id: string,
    userId: string,
    updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID "${id}" not found`);
    }
    if (post.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You do not have permission to update this post.',
        );
      }
    }
    return this.prisma.blogPost.update({
      where: { id },
      data: updateBlogPostDto,
      include: this.getCommonInclude(),
    });
  }

  async remove(id: string, userId: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID "${id}" not found`);
    }
    if (post.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You do not have permission to delete this post.',
        );
      }
    }
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async likePost(id: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID "${id}" not found`);
    }
    return this.prisma.blogPost.update({
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
