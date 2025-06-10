import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Enrollment, Prisma, User as PrismaUser } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, courseId: string): Promise<Enrollment> {
    // 1. Verificar que el curso exista y esté publicado (o el usuario sea admin)
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }

    // 2. Verificar si el usuario ya está inscrito
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existingEnrollment) {
      throw new ConflictException(
        `User is already enrolled in course "${courseId}".`,
      );
    }

    // 3. Crear la inscripción
    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: { course: true }, // Incluir detalles del curso en la respuesta
    });
  }

  async findAllByCurrentUser(
    userId: string,
    params?: {
      includeCourseDetails?: boolean;
      skip?: number;
      take?: number;
    },
  ): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: params?.includeCourseDetails
          ? {
              include: {
                // Opcional: incluir el número de capítulos para mostrar progreso general
                _count: {
                  select: { chapters: { where: { isPublished: true } } },
                },
              },
            }
          : false,
      },
      orderBy: { enrolledAt: 'desc' },
      skip: params?.skip,
      take: params?.take,
    });
  }

  async findOneByCurrentUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: {
          include: {
            chapters: {
              where: { isPublished: true },
              orderBy: { position: 'asc' },
              include: {
                chapterNotes: { where: { userId } },
                chapterProgress: { where: { userId } },
              },
            },
            _count: {
              select: { chapters: { where: { isPublished: true } } },
            },
          },
        },
      },
    });
  }
  async findOneByCurrentUserAndCourseStatus(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true },
    });
  }

  async removeByCurrentUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment> {
    try {
      return await this.prisma.enrollment.delete({
        where: { userId_courseId: { userId, courseId } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Enrollment not found for user "${userId}" in course "${courseId}".`,
        );
      }
      throw error;
    }
  }

  // --- Métodos para Administradores ---
  async findAllByCourseForAdmin(
    courseId: string,
    params?: {
      skip?: number;
      take?: number;
    },
  ): Promise<Enrollment[]> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      }, // Incluir detalles del usuario
      orderBy: { enrolledAt: 'desc' },
      skip: params?.skip,
      take: params?.take,
    });
  }

  async findAllByUserForAdmin(
    userId: string,
    params?: {
      skip?: number;
      take?: number;
    },
  ): Promise<Enrollment[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
      skip: params?.skip,
      take: params?.take,
    });
  }

  async removeByEnrollmentIdForAdmin(
    enrollmentId: string,
  ): Promise<Enrollment> {
    try {
      return await this.prisma.enrollment.delete({
        where: { id: enrollmentId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Enrollment with ID "${enrollmentId}" not found.`,
        );
      }
      throw error;
    }
  }
}
