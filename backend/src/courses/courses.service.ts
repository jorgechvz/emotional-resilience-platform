import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Asegúrate que PrismaService esté configurado y exportado
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Aquí podrías añadir lógica para asociar con un instructor/autor si lo tuvieras
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    language?: string; // Si quieres filtrar por idioma
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.course.findMany({
      skip,
      take,
      where: {
        ...where,
        ...(params.language && { language: params.language }), // Filtrar por idioma si se proporciona
      },
      cursor,
      orderBy,
      include: {
        chapters: {
          where: { isPublished: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findAllAdmin(params: {
    // Para que un admin vea todos, publicados o no
    skip?: number;
    take?: number;
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.course.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { chapters: { orderBy: { position: 'asc' } } },
    });
  }

  async findOne(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException(
        `Course with ID "${id}" not found or not published.`,
      );
    }
    return course;
  }

  async findOneAdmin(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { position: 'asc' },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found.`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Course with ID "${id}" not found.`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Course> {
    try {
      return await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Course with ID "${id}" not found.`);
      }
      throw error;
    }
  }
}
