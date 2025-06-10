import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({
    example: 'My First Blog Post',
    description: 'Title of the blog post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of my first blog post...',
    description: 'Main content of the blog post',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: ['nestjs', 'prisma', 'blog'],
    description: 'Tags for the blog post',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    example: 'John Doe',
    description:
      'Author of the blog post (will be auto-filled if not provided)',
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;
}
