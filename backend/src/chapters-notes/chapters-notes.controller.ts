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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ChapterNotesService } from './chapters-notes.service';
import { CreateChapterNoteDto } from './dto/create-chapters-note.dto';
import { ChapterNoteEntity } from './entities/chapters-note.entity';
import { UpdateChapterNoteDto } from './dto/update-chapters-note.dto';

@ApiTags('Chapter Notes (User-specific, nested under Chapters)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses/:courseId/chapters/:chapterId/notes')
export class ChapterNotesController {
  constructor(private readonly chapterNotesService: ChapterNotesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new personal note for the current user on a specific chapter',
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully.',
    type: ChapterNoteEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (e.g., user not enrolled).',
  })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async create(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() createChapterNoteDto: CreateChapterNoteDto,
  ): Promise<ChapterNoteEntity> {
    const note = await this.chapterNotesService.create(
      userId,
      courseId,
      chapterId,
      createChapterNoteDto,
    );
    return new ChapterNoteEntity(note);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all personal notes for the current user on a specific chapter',
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
  @ApiResponse({
    status: 200,
    description: 'List of user notes for the chapter.',
    type: [ChapterNoteEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Course or Chapter not found.' })
  async findAllByUserAndChapter(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ): Promise<ChapterNoteEntity[]> {
    const notes = await this.chapterNotesService.findAllByUserAndChapter(
      userId,
      courseId,
      chapterId,
    );
    return notes.map((note) => new ChapterNoteEntity(note));
  }

  // GET, PATCH, DELETE para una nota específica por su ID
  // Estas rutas no necesitan courseId/chapterId si el noteId es globalmente único
  // Pero para consistencia y autorización, es bueno mantenerlas anidadas o verificar la pertenencia
  // Aquí las haré anidadas para que el servicio pueda verificar la pertenencia al capítulo si es necesario.

  @Get(':noteId')
  @ApiOperation({
    summary: 'Get a specific personal note by ID for the current user',
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course (for context)' })
  @ApiParam({
    name: 'chapterId',
    description: 'ID of the chapter (for context)',
  })
  @ApiParam({ name: 'noteId', description: 'ID of the note' })
  @ApiResponse({
    status: 200,
    description: 'Note details.',
    type: ChapterNoteEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: "Forbidden (not user's note)." })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async findOne(
    @GetUser('id') userId: string,
    @Param('noteId') noteId: string,
    // @Param('chapterId') chapterId: string, // No es estrictamente necesario si noteId es único
    // @Param('courseId') courseId: string,   // y el servicio verifica la propiedad del usuario
  ): Promise<ChapterNoteEntity> {
    // El servicio findOne debe verificar que la nota pertenece al userId
    const note = await this.chapterNotesService.findOne(userId, noteId);
    return new ChapterNoteEntity(note);
  }

  @Patch(':noteId')
  @ApiOperation({
    summary: 'Update a specific personal note by ID for the current user',
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course (for context)' })
  @ApiParam({
    name: 'chapterId',
    description: 'ID of the chapter (for context)',
  })
  @ApiParam({ name: 'noteId', description: 'ID of the note to update' })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully.',
    type: ChapterNoteEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: "Forbidden (not user's note)." })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async update(
    @GetUser('id') userId: string,
    @Param('noteId') noteId: string,
    @Body() updateChapterNoteDto: UpdateChapterNoteDto,
  ): Promise<ChapterNoteEntity> {
    const note = await this.chapterNotesService.update(
      userId,
      noteId,
      updateChapterNoteDto,
    );
    return new ChapterNoteEntity(note);
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a specific personal note by ID for the current user',
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course (for context)' })
  @ApiParam({
    name: 'chapterId',
    description: 'ID of the chapter (for context)',
  })
  @ApiParam({ name: 'noteId', description: 'ID of the note to delete' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: "Forbidden (not user's note)." })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async remove(
    @GetUser('id') userId: string,
    @Param('noteId') noteId: string,
  ): Promise<void> {
    await this.chapterNotesService.remove(userId, noteId);
  }
}
