import { ApiProperty } from '@nestjs/swagger';
import { ChapterProgress as PrismaChapterProgress } from '@prisma/client';

export class ChapterProgressEntity implements PrismaChapterProgress {
  @ApiProperty({
    example: 'clqj4e5x00002u0p0g1h1a1b3',
    description: 'Unique identifier for the chapter progress record',
  })
  id: string;

  @ApiProperty({ example: 'user_id_example', description: 'ID of the user' })
  userId: string;

  @ApiProperty({
    example: 'chapter_id_example',
    description: 'ID of the chapter',
  })
  chapterId: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user has completed the chapter',
  })
  isCompleted: boolean;

  @ApiProperty({
    example: '2023-01-10T10:00:00.000Z',
    required: false,
    description: 'Timestamp when the chapter was marked as completed',
  })
  completedAt: Date | null;

  @ApiProperty({
    example: '2023-01-10T09:00:00.000Z',
    description: 'Timestamp of creation',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-10T10:00:00.000Z',
    description: 'Timestamp of last update',
  })
  updatedAt: Date;

  constructor(partial: Partial<ChapterProgressEntity>) {
    Object.assign(this, partial);
  }
}
