import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateChapterNoteDto {
  @ApiProperty({
    example: 'Mi reflexión principal',
    required: false,
    description: 'Optional title for the note',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    example: 'Este capítulo me hizo pensar en...',
    description: 'The content of the note',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
