import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ChapterProgressService } from './chapters-progress.service';
import { CreateChaptersProgressDto } from './dto/create-chapters-progress.dto';
import { ChapterProgressEntity } from './entities/chapters-progress.entity';

@ApiTags('Chapter Progress (User-specific, nested under Chapters)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses/:courseId/chapters/:chapterId/progress')
export class ChapterProgressController {
  constructor(
    private readonly chapterProgressService: ChapterProgressService,
  ) {}

  @Put()
  @ApiOperation({
    summary: "Update the current user's progress for a specific chapter",
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiResponse({
    status: 200,
    description: 'Progress updated successfully.',
    type: ChapterProgressEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (e.g., user not enrolled).',
  })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async upsertChapterProgress(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() upsertChapterProgressDto: CreateChaptersProgressDto,
  ): Promise<ChapterProgressEntity> {
    const progress = await this.chapterProgressService.upsertChapterProgress(
      userId,
      courseId,
      chapterId,
      upsertChapterProgressDto,
    );
    return new ChapterProgressEntity(progress);
  }

  @Get()
  @ApiOperation({
    summary: "Get the current user's progress for a specific chapter",
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiResponse({
    status: 200,
    description: 'User progress for the chapter.',
    type: ChapterProgressEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async getChapterProgressForUser(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ): Promise<ChapterProgressEntity | null> {
    const progress =
      await this.chapterProgressService.getChapterProgressForUser(
        userId,
        courseId,
        chapterId,
      );
    return progress ? new ChapterProgressEntity(progress) : null;
  }
}

// También podrías tener un controlador a nivel de curso para obtener todo el progreso de un usuario en ese curso
@ApiTags('Course Progress (User-specific, nested under Courses)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses/:courseId/progress') // Ruta diferente
export class UserCourseProgressController {
  constructor(
    private readonly chapterProgressService: ChapterProgressService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      "Get the current user's progress for all chapters in a specific course",
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiResponse({
    status: 200,
    description: 'List of user progress for the course chapters.',
    type: [ChapterProgressEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getAllChapterProgressForCourseByUser(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<ChapterProgressEntity[]> {
    const progresses =
      await this.chapterProgressService.getAllChapterProgressForCourseByUser(
        userId,
        courseId,
      );
    return progresses.map((p) => new ChapterProgressEntity(p));
  }
}
