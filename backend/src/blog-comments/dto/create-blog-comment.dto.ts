import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogCommentDto {
  @ApiProperty({
    example: 'Great post!',
    description: 'Content of the comment',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Author of the comment (will be auto-filled if not provided)',
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;
}
