import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateBlogPostDto {
  @ApiPropertyOptional({
    example: 'Updated Blog Post Title',
    description: 'New title for the blog post',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated content...',
    description: 'New content for the blog post',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: ['updated', 'tutorial'],
    description: 'New tags for the blog post',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: 'Jane Doe',
    description: 'Updated author name',
  })
  @IsOptional()
  @IsString()
  author?: string;
}
