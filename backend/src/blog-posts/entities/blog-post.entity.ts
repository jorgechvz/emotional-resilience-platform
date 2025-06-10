// filepath: src/blog-posts/entities/blog-post.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  BlogPost as PrismaBlogPost,
  User as PrismaUser,
  BlogComment as PrismaBlogComment,
} from '@prisma/client';
import { BlogCommentEntity } from 'src/blog-comments/entities/blog-comment.entity';
import { UserSummaryEntity } from 'src/discussions/entities/user-summary.entity';

export class BlogPostEntity implements Omit<PrismaBlogPost, 'userId'> {
  @ApiProperty({
    example: 'clqj4i5x00001u0p0g1h1a1b2',
    description: 'Unique identifier for the blog post',
  })
  id: string;

  @ApiProperty({ example: 'My First Blog Post' })
  title: string;

  @ApiProperty({ example: 'This is the content...' })
  content: string;

  @ApiProperty({ example: '2023-10-27T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'John Doe', required: false, nullable: true })
  author: string | null;

  @ApiProperty({ example: 15, default: 0 })
  likes: number;

  @ApiProperty({ example: ['nestjs', 'prisma'], type: [String] })
  tags: string[];

  @ApiProperty({
    type: () => UserSummaryEntity,
    description: 'Author of the post',
  })
  user: UserSummaryEntity;

  @ApiProperty({
    type: () => [BlogCommentEntity],
    required: false,
    description: 'Comments on the post',
  })
  comments?: BlogCommentEntity[];

  @ApiProperty({
    example: 5,
    required: false,
    description: 'Number of comments on the post',
  })
  commentsCount?: number;

  constructor(
    partial: Partial<
      BlogPostEntity & {
        user: PrismaUser;
        _count?: { comments: number };
        comments?: PrismaBlogComment[];
      }
    >,
  ) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserSummaryEntity(partial.user);
    }
    if (partial.comments) {
      this.comments = partial.comments.map(
        (comment) => new BlogCommentEntity(comment as any),
      ); 
    }
    if (partial._count?.comments !== undefined) {
      this.commentsCount = partial._count.comments;
    }
  }
}
