import { ApiProperty } from '@nestjs/swagger';
import { Chapter as PrismaChapter } from '@prisma/client';
import { IsOptional } from 'class-validator';
// Import other related entities if you plan to include them in responses
// For example, if you want to show notes or discussions directly:
// import { ChapterNoteEntity } from '../../chapter-notes/entities/chapter-note.entity';
// import { DiscussionEntity } from '../../discussions/entities/discussion.entity';

export class ChapterEntity implements PrismaChapter {
  @ApiProperty({
    example: 'clqj4d5x00001u0p0g1h1a1b2',
    description: 'Unique identifier for the chapter',
  })
  id: string;

  @ApiProperty({
    example: 'Introducción a la Resiliencia',
    description: 'The title of the chapter',
  })
  title: string;

  @ApiProperty({
    example:
      'Este capítulo cubre los fundamentos de la resiliencia emocional...',
    description: 'The main content of the chapter',
  })
  content: string;

  @ApiProperty({
    example: ['http://example.com/video1.mp4'],
    required: false,
    description: 'List of video URLs for the chapter',
  })
  videoUrls: string[];

  @ApiProperty({
    example: 3600,
    description: 'Duration of the chapter in seconds',
    required: false,
    type: Number,
    default: 0,
  })
  @IsOptional()
  duration: number;
  @ApiProperty({
    example: 1,
    description: 'The position of the chapter within the course',
  })
  position: number;

  @ApiProperty({
    example: true,
    description: 'Whether the chapter is published',
  })
  isPublished: boolean;

  @ApiProperty({
    example: 'clqj4c2z00000u0p0h1g1a1b1',
    description: 'ID of the course this chapter belongs to',
  })
  courseId: string;

  @ApiProperty({
    example: '2023-01-01T12:01:00.000Z',
    description: 'Creation date of the chapter',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T12:01:00.000Z',
    description: 'Last update date of the chapter',
  })
  updatedAt: Date;

  // Optional: If you want to include related data directly
  // @ApiProperty({ type: () => [ChapterNoteEntity], required: false })
  // chapterNotes?: ChapterNoteEntity[];

  // @ApiProperty({ type: () => [DiscussionEntity], required: false })
  // discussions?: DiscussionEntity[];

  constructor(partial: Partial<ChapterEntity>) {
    Object.assign(this, partial);
  }
}
