import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Hallar fortaleza en el Señor: Resiliencia emocional',
    description: 'The title of the course',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Un curso sobre cómo desarrollar resiliencia emocional a través de la fe.',
    required: false,
    description: 'A brief description of the course',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    required: false,
    description: 'URL of the course image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
