import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DiscussionReply, Prisma } from '@prisma/client';
import { CreateDiscussionReplyDto } from './dto/create-discussions-reply.dto';
import { UpdateDiscussionReplyDto } from './dto/update-discussions-reply.dto';

@Injectable()
export class DiscussionRepliesService {
  constructor(private prisma: PrismaService) {}

  private getReplyIncludeOptions() {
    return {
      user: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { childReplies: true } },
    };
  }

  async create(
    userId: string,
    createDto: CreateDiscussionReplyDto,
  ): Promise<DiscussionReply> {
    // Verificar que la discusión exista
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: createDto.discussionId },
      select: {
        id: true,
        chapter: {
          select: {
            courseId: true,
          },
        },
      },
    });
    if (!discussion || !discussion.chapter) {
      throw new NotFoundException(
        `Discussion with ID "${createDto.discussionId}" not found or has no associated chapter.`,
      );
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: discussion.chapter.courseId },
      },
    });
    if (!enrollment) {
      throw new ForbiddenException(
        `User "${userId}" is not enrolled in the course of this discussion. Cannot reply.`,
      );
    }

    if (createDto.parentReplyId) {
      const parentReply = await this.prisma.discussionReply.findUnique({
        where: { id: createDto.parentReplyId },
      });

      if (!parentReply || parentReply.discussionId !== createDto.discussionId) {
        throw new NotFoundException(
          `Parent reply with ID "${createDto.parentReplyId}" not found or does not belong to discussion "${createDto.discussionId}".`,
        );
      }
    }

    return this.prisma.discussionReply.create({
      data: {
        content: createDto.content,
        userId,
        discussionId: createDto.discussionId,
        parentReplyId: createDto.parentReplyId,
      },
      include: this.getReplyIncludeOptions(),
    });
  }

  async findChildrenOfReply(
    parentReplyId: string,
    params: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.DiscussionReplyOrderByWithRelationInput;
    } = {},
  ): Promise<DiscussionReply[]> {
    const { skip = 0, take = 10, orderBy = { createdAt: 'asc' } } = params;

    const parentReply = await this.prisma.discussionReply.findUnique({
      where: { id: parentReplyId },
    });
    if (!parentReply) {
      throw new NotFoundException(
        `Parent reply with ID "${parentReplyId}" not found.`,
      );
    }

    return this.prisma.discussionReply.findMany({
      where: { parentReplyId },
      include: this.getReplyIncludeOptions(),
      orderBy,
      skip,
      take,
    });
  }

  async findOne(replyId: string): Promise<DiscussionReply | null> {
    const reply = await this.prisma.discussionReply.findUnique({
      where: { id: replyId },
      include: this.getReplyIncludeOptions(),
    });
    if (!reply) {
      throw new NotFoundException(`Reply with ID "${replyId}" not found.`);
    }
    return reply;
  }

  async update(
    replyId: string,
    userId: string,
    updateDto: UpdateDiscussionReplyDto,
  ): Promise<DiscussionReply> {
    const reply = await this.prisma.discussionReply.findUnique({
      where: { id: replyId },
    });
    if (!reply) {
      throw new NotFoundException(`Reply with ID "${replyId}" not found.`);
    }
    if (reply.userId !== userId) {
      // Aquí podrías añadir lógica para roles de ADMIN/Moderador si es necesario
      throw new ForbiddenException(
        'You do not have permission to update this reply.',
      );
    }
    return this.prisma.discussionReply.update({
      where: { id: replyId },
      data: { content: updateDto.content },
      include: this.getReplyIncludeOptions(),
    });
  }

  async remove(replyId: string, userId: string): Promise<DiscussionReply> {
    const reply = await this.prisma.discussionReply.findUnique({
      where: { id: replyId },
      include: { childReplies: { select: { id: true } } },
    });

    if (!reply) {
      throw new NotFoundException(`Reply with ID "${replyId}" not found.`);
    }

    if (reply.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this reply.',
      );
    }

    // Estrategia de borrado de hijos:
    // 1. Si tiene hijos y onDelete es NoAction (como en tu schema), borrarlos primero o reasignarlos.
    //    Por simplicidad aquí, vamos a borrar los hijos recursivamente.
    //    Una solución más robusta podría ser una transacción o un borrado en cascada a nivel de servicio.
    //    Prisma no soporta borrado en cascada para relaciones auto-referenciadas con onDelete: NoAction directamente en una sola query.
    //    Si el schema tuviera onDelete: Cascade en la relación ReplyToReply, esto sería más simple.
    //    Dado el schema actual, si borramos un padre, los hijos quedarían huérfanos con un parentReplyId inválido.

    if (reply.childReplies.length > 0) {
      // Opción A: Borrar hijos (puede ser lento si hay muchos niveles)
      // await this.prisma.discussionReply.deleteMany({ where: { parentReplyId: replyId }}); // Esto borraría solo un nivel. Recursivo es más complejo.
      // Opción B: Impedir borrado si tiene hijos (más simple por ahora)
      throw new ForbiddenException(
        'Cannot delete this reply because it has child replies. Delete them first or contact an admin.',
      );
    }

    return this.prisma.discussionReply.delete({
      where: { id: replyId },
    });
  }
}
