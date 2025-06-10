import { ApiProperty } from '@nestjs/swagger';
import { Course as PrismaCourse } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { ChapterEntity } from 'src/chapters/entities/chapter.entity';

export class CourseEntity implements PrismaCourse {
  @ApiProperty({
    example: 'clqj4c2z00000u0p0h1g1a1b1',
    description: 'Unique identifier for the course',
  })
  id: string;

  @ApiProperty({
    example: 'Hallar fortaleza en el Señor: Resiliencia emocional',
    description: 'The title of the course',
  })
  title: string;

  @ApiProperty({
    example:
      'Un curso sobre cómo desarrollar resiliencia emocional a través de la fe.',
    required: false,
    description: 'A brief description of the course',
  })
  description: string | null;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    required: false,
    description: 'URL of the course image',
  })
  imageUrl: string | null;
  
  @ApiProperty({
    example: 'en',
    description: 'Language of the course',
  })
  @IsOptional()
  language: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'Creation date of the course',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T12:00:00.000Z',
    description: 'Last update date of the course',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => [ChapterEntity],
    required: false,
    description: 'Chapters included in the course',
  })
  chapters?: ChapterEntity[];

  constructor(partial: Partial<CourseEntity>) {
    Object.assign(this, partial);
  }
}
