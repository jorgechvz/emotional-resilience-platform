import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter, Prisma, User } from '@prisma/client'; // Import User if needed for auth checks

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  async create(
    courseId: string,
    createChapterDto: CreateChapterDto,
  ): Promise<Chapter> {
    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }

    return this.prisma.chapter.create({
      data: {
        ...createChapterDto,
        courseId,
      },
    });
  }

  async findAllByCourse(
    courseId: string,
    currentUser?: User, // Pass current user for auth checks if needed
  ): Promise<Chapter[]> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }

    let whereClause: Prisma.ChapterWhereInput = { courseId };

    return this.prisma.chapter.findMany({
      where: whereClause,
      orderBy: {
        position: 'asc',
      },
    });
  }

  async findOne(
    courseId: string,
    chapterId: string,
    currentUser?: User, // Pass current user for auth checks
  ): Promise<Chapter | null> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });

    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }

    // Example: Non-admins can only see published chapters
    if (!currentUser) {
      throw new ForbiddenException(
        'You do not have permission to view this chapter.',
      );
    }

    return chapter;
  }

  async update(
    courseId: string,
    chapterId: string,
    updateChapterDto: UpdateChapterDto,
  ): Promise<Chapter> {
    // Verify chapter exists in the given course
    const existingChapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!existingChapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }

    try {
      return await this.prisma.chapter.update({
        where: { id: chapterId },
        data: updateChapterDto,
      });
    } catch (error) {
      // P2025 is "Record to update not found"
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Chapter with ID "${chapterId}" not found.`,
        );
      }
      throw error;
    }
  }

  async remove(courseId: string, chapterId: string): Promise<Chapter> {
    // Verify chapter exists in the given course before attempting delete
    const existingChapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });
    if (!existingChapter) {
      throw new NotFoundException(
        `Chapter with ID "${chapterId}" not found in course "${courseId}".`,
      );
    }
    try {
      return await this.prisma.chapter.delete({
        where: { id: chapterId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Chapter with ID "${chapterId}" not found.`,
        );
      }
      throw error;
    }
  }
}
