import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChapterNote, User } from '@prisma/client';
import { CreateChapterNoteDto } from './dto/create-chapters-note.dto';
import { UpdateChapterNoteDto } from './dto/update-chapters-note.dto';

@Injectable()
export class ChapterNotesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    courseId: string, // Para verificar pertenencia del capítulo
    chapterId: string,
    createChapterNoteDto: CreateChapterNoteDto,
  ): Promise<ChapterNote> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }
    // Opcional: Verificar si el usuario está inscrito en el curso
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      throw new ForbiddenException(
        `User "${userId}" is not enrolled in course "${courseId}". Cannot create note.`,
      );
    }

    return this.prisma.chapterNote.create({
      data: {
        ...createChapterNoteDto,
        userId,
        chapterId,
      },
    });
  }

  async findAllByUserAndChapter(
    userId: string,
    courseId: string,
    chapterId: string,
  ): Promise<ChapterNote[]> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }
    return this.prisma.chapterNote.findMany({
      where: {
        userId,
        chapterId,
      },
      orderBy: {
        updatedAt: 'desc', // O createdAt, según preferencia
      },
    });
  }

  async findOne(
    userId: string, // El usuario solo puede acceder a sus propias notas
    noteId: string,
  ): Promise<ChapterNote | null> {
    const note = await this.prisma.chapterNote.findUnique({
      where: { id: noteId },
    });
    if (!note) {
      throw new NotFoundException(`Note with ID "${noteId}" not found.`);
    }
    if (note.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this note.',
      );
    }
    return note;
  }

  async update(
    userId: string, // El usuario solo puede actualizar sus propias notas
    noteId: string,
    updateChapterNoteDto: UpdateChapterNoteDto,
  ): Promise<ChapterNote> {
    const note = await this.findOne(userId, noteId); // Reutiliza findOne para la verificación de propiedad y existencia
    if (!note)
      throw new NotFoundException(
        `Note with ID "${noteId}" not found or access denied.`,
      ); // Redundante si findOne lanza, pero seguro

    return this.prisma.chapterNote.update({
      where: { id: noteId }, // userId ya verificado en findOne
      data: updateChapterNoteDto,
    });
  }

  async remove(userId: string, noteId: string): Promise<ChapterNote> {
    const note = await this.findOne(userId, noteId); // Reutiliza findOne
    if (!note)
      throw new NotFoundException(
        `Note with ID "${noteId}" not found or access denied.`,
      );

    return this.prisma.chapterNote.delete({
      where: { id: noteId },
    });
  }
}
