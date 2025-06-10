import { ApiProperty } from '@nestjs/swagger';
import { ChapterNote as PrismaChapterNote } from '@prisma/client';

export class ChapterNoteEntity implements PrismaChapterNote {
  @ApiProperty({
    example: 'clqj4f5x00003u0p0g1h1a1b4',
    description: 'Unique identifier for the chapter note',
  })
  id: string;

  @ApiProperty({
    example: 'user_id_example',
    description: 'ID of the user who owns the note',
  })
  userId: string;

  @ApiProperty({
    example: 'chapter_id_example',
    description: 'ID of the chapter this note belongs to',
  })
  chapterId: string;

  @ApiProperty({
    example: 'Mi reflexión principal',
    required: false,
    description: 'Title of the note',
  })
  title: string | null;

  @ApiProperty({
    example: 'Este capítulo me hizo pensar en...',
    description: 'Content of the note',
  })
  content: string;

  @ApiProperty({
    example: '2023-01-10T11:00:00.000Z',
    description: 'Timestamp of creation',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-10T11:05:00.000Z',
    description: 'Timestamp of last update',
  })
  updatedAt: Date;

  constructor(partial: Partial<ChapterNoteEntity>) {
    Object.assign(this, partial);
  }
}
