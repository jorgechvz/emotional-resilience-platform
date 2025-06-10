import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min, IsArray, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({ example: 'Introducción a la Resiliencia', description: 'The title of the chapter' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Este capítulo cubre los fundamentos de la resiliencia emocional...', description: 'The main content of the chapter' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: ['http://example.com/video1.mp4', 'http://example.com/video2.mp4'], required: false, description: 'Optional list of video URLs for the chapter' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true }) // Validates each string in the array is a URL
  videoUrls?: string[];

  @ApiProperty({ example: 1, description: 'The position of the chapter within the course (e.g., 1, 2, 3)' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty({ example: false, default: false, description: 'Whether the chapter is published and visible to users' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}