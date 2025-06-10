import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User as PrismaUser } from '@prisma/client';
import { ChapterEntity } from './entities/chapter.entity';
import { GetUser } from '../auth/decorators/get-user.decorator'; // Assuming you have this decorator

@ApiTags('Chapters (Nested under Courses)')
@Controller('courses/:courseId/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new chapter within a course (Admin only)' })
  @ApiParam({ name: 'courseId', description: 'ID of the course to add chapter to' })
  @ApiResponse({ status: 201, description: 'Chapter successfully created.', type: ChapterEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async create(
    @Param('courseId') courseId: string,
    @Body() createChapterDto: CreateChapterDto,
  ): Promise<ChapterEntity> {
    const chapter = await this.chaptersService.create(courseId, createChapterDto);
    return new ChapterEntity(chapter);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Optional: if users must be logged in
  @ApiBearerAuth() // If JwtAuthGuard is used
  @ApiOperation({ summary: 'Get all chapters for a specific course' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiResponse({ status: 200, description: 'List of chapters for the course.', type: [ChapterEntity] })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async findAllByCourse(
    @Param('courseId') courseId: string,
    @GetUser() user?: PrismaUser, // GetUser is optional, for auth checks in service
  ): Promise<ChapterEntity[]> {
    const chapters = await this.chaptersService.findAllByCourse(courseId, user);
    return chapters.map(chapter => new ChapterEntity(chapter));
  }

  @Get(':chapterId')
  @UseGuards(JwtAuthGuard) // Optional
  @ApiBearerAuth() // If JwtAuthGuard is used
  @ApiOperation({ summary: 'Get a specific chapter by ID within a course' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiResponse({ status: 200, description: 'Chapter details.', type: ChapterEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized (if auth is required and fails).' })
  @ApiResponse({ status: 403, description: 'Forbidden (if user cannot access unpublished chapter).' })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async findOne(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @GetUser() user?: PrismaUser, // GetUser is optional
  ): Promise<ChapterEntity> {
    const chapter = await this.chaptersService.findOne(courseId, chapterId, user);
    return new ChapterEntity(chapter);
  }

  @Patch(':chapterId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a chapter by ID within a course (Admin only)' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter to update' })
  @ApiResponse({ status: 200, description: 'Chapter successfully updated.', type: ChapterEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async update(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ): Promise<ChapterEntity> {
    const chapter = await this.chaptersService.update(courseId, chapterId, updateChapterDto);
    return new ChapterEntity(chapter);
  }

  @Delete(':chapterId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chapter by ID within a course (Admin only)' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter to delete' })
  @ApiResponse({ status: 204, description: 'Chapter successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async remove(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ): Promise<void> {
    await this.chaptersService.remove(courseId, chapterId);
  }
}