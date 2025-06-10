import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBlogCommentDto {
  @ApiPropertyOptional({
    example: 'Actually, I meant to say...',
    description: 'New content for the comment',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'Jane Doe',
    description: 'Updated author name',
  })
  @IsOptional()
  @IsString()
  author?: string;
}
