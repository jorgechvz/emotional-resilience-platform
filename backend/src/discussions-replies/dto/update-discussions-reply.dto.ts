import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDiscussionReplyDto {
  @ApiProperty({
    example: 'He actualizado mi respuesta.',
    description: 'The new content of the reply.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}