import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Asume que tienes JwtAuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // Asume que tienes RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // Asume que tienes Roles decorator
import { Role } from '@prisma/client'; // Asume que tienes el enum Role
import { CourseEntity } from './entities/course.entity';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Solo Admins pueden crear cursos
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  @ApiResponse({ status: 201, description: 'The course has been successfully created.', type: CourseEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    const course = await this.coursesService.create(createCourseDto);
    return new CourseEntity(course);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip for pagination' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take for pagination' })
  @ApiQuery({ name: 'language', required: false, type: String, description: 'Filter courses by language' })
  @ApiResponse({ status: 200, description: 'List of published courses.', type: [CourseEntity] })
  async findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
    @Query('language', new DefaultValuePipe('en')) language?: string, // Asume que el idioma por defecto es 'en'
  ): Promise<CourseEntity[]> {
    const courses = await this.coursesService.findAll({ skip, take, language });
    return courses.map(course => new CourseEntity(course));
  }
  
  @Get('admin/all') // Endpoint para que admin vea todos los cursos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all courses (Admin only, includes unpublished)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of all courses.', type: [CourseEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAllAdmin(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<CourseEntity[]> {
    const courses = await this.coursesService.findAllAdmin({ skip, take });
    return courses.map(course => new CourseEntity(course));
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a specific published course by ID' })
  @ApiResponse({ status: 200, description: 'The course details.', type: CourseEntity })
  @ApiResponse({ status: 404, description: 'Course not found or not published.' })
  async findOne(@Param('id') id: string): Promise<CourseEntity> {
    const course = await this.coursesService.findOne(id);
    return new CourseEntity(course);
  }
  
  @Get('admin/:id') // Endpoint para que admin vea un curso específico, publicado o no
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific course by ID (Admin only, includes unpublished)' })
  @ApiResponse({ status: 200, description: 'The course details.', type: CourseEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async findOneAdmin(@Param('id') id: string): Promise<CourseEntity> {
    const course = await this.coursesService.findOneAdmin(id);
    return new CourseEntity(course);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Solo Admins pueden actualizar cursos
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'The course has been successfully updated.', type: CourseEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<CourseEntity> {
    const course = await this.coursesService.update(id, updateCourseDto);
    return new CourseEntity(course);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Solo Admins pueden eliminar cursos
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course by ID (Admin only)' })
  @ApiResponse({ status: 204, description: 'The course has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.coursesService.remove(id);
  }
}