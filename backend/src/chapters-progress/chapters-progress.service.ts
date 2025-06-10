import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChapterProgress, User } from '@prisma/client';
import { CreateChaptersProgressDto } from './dto/create-chapters-progress.dto';

@Injectable()
export class ChapterProgressService {
  constructor(private prisma: PrismaService) {}

  async upsertChapterProgress(
    userId: string,
    courseId: string, // courseId para verificar la pertenencia del chapter
    chapterId: string,
    upsertDto: CreateChaptersProgressDto,
  ): Promise<ChapterProgress> {
    // 1. Verificar que el capítulo pertenece al curso
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }

    // 2. Verificar si el usuario está inscrito en el curso (opcional, pero recomendado)
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      throw new ForbiddenException(
        `User "${userId}" is not enrolled in course "${courseId}". Cannot track progress.`,
      );
    }

    // 3. Upsert el progreso
    const completedAt = upsertDto.isCompleted ? new Date() : null;

    return this.prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted: upsertDto.isCompleted,
        completedAt,
      },
      create: {
        userId,
        chapterId,
        isCompleted: upsertDto.isCompleted,
        completedAt,
      },
    });
  }

  async getChapterProgressForUser(
    userId: string,
    courseId: string,
    chapterId: string,
  ): Promise<ChapterProgress | null> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }

    return this.prisma.chapterProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
  }

  async getAllChapterProgressForCourseByUser(
    userId: string,
    courseId: string,
  ): Promise<ChapterProgress[]> {
    // Verificar que el curso exista
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }

    return this.prisma.chapterProgress.findMany({
      where: {
        userId,
        chapter: {
          courseId: courseId,
        },
      },
      include: {
        // Opcional: incluir detalles del capítulo si es necesario
        chapter: {
          select: { id: true, title: true, position: true },
        },
      },
      orderBy: {
        chapter: { position: 'asc' },
      },
    });
  }
}
