import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Discussion, Prisma, User as PrismaUser } from '@prisma/client';

@Injectable()
export class DiscussionsService {
  constructor(private prisma: PrismaService) {}

  private getCommonInclude(currentUser?: PrismaUser) {
    return {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    };
  }

  async create(
    userId: string,
    courseId: string,
    chapterId: string,
    createDiscussionDto: CreateDiscussionDto,
  ): Promise<Discussion> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      throw new ForbiddenException(
        `User "${userId}" is not enrolled in course "${courseId}". Cannot start discussion.`,
      );
    }

    return this.prisma.discussion.create({
      data: {
        ...createDiscussionDto,
        userId,
        chapterId,
      },
      include: this.getCommonInclude(),
    });
  }

  async findAllByChapter(
    chapterId: string,
    params: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.DiscussionOrderByWithRelationInput;
    } = {},
  ): Promise<Discussion[]> {
    const { skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = params;
    return this.prisma.discussion.findMany({
      where: { chapterId },
      include: {
        user: this.getCommonInclude().user,
        replies: {
          where: { parentReplyId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
            childReplies: {
              orderBy: { createdAt: 'asc' },
              include: {
                user: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
        _count: { select: { replies: true } },
      },
      orderBy,
      skip,
      take,
    });
  }

  async findOne(discussionId: string): Promise<Discussion | null> {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        user: this.getCommonInclude().user,
        replies: {
          where: { parentReplyId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
            childReplies: {
              orderBy: { createdAt: 'asc' },
              include: {
                user: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
        _count: { select: { replies: true } },
      },
    });
    if (!discussion) {
      throw new NotFoundException(
        `Discussion with ID "${discussionId}" not found.`,
      );
    }
    return discussion;
  }

  async update(
    userId: string,
    discussionId: string,
    updateDiscussionDto: UpdateDiscussionDto,
  ): Promise<Discussion> {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      throw new NotFoundException(
        `Discussion with ID "${discussionId}" not found.`,
      );
    }
    if (discussion.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this discussion.',
      );
    }

    return this.prisma.discussion.update({
      where: { id: discussionId },
      data: updateDiscussionDto,
      include: this.getCommonInclude(),
    });
  }

  async remove(userId: string, discussionId: string): Promise<Discussion> {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      throw new NotFoundException(
        `Discussion with ID "${discussionId}" not found.`,
      );
    }
    if (discussion.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this discussion.',
      );
    }

    return this.prisma.discussion.delete({
      where: { id: discussionId },
    });
  }
}
