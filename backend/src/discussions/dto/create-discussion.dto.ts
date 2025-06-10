import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateDiscussionDto {
  @ApiProperty({
    example: '¿Cómo aplicar el principio de la gratitud?',
    description: 'The title of the discussion topic.',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Me gustaría saber cómo otros hermanos han encontrado formas prácticas de aplicar la gratitud diariamente, especialmente en momentos difíciles.',
    description: 'The main content or question of the discussion.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

}