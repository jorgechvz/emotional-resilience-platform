import { ApiProperty } from '@nestjs/swagger';
import {
  BlogComment as PrismaBlogComment,
  User as PrismaUser,
} from '@prisma/client';
import { UserSummaryEntity } from 'src/discussions/entities/user-summary.entity';

export class BlogCommentEntity
  implements Omit<PrismaBlogComment, 'userId' | 'blogPostId'>
{
  @ApiProperty({
    example: 'clqj4i5x00002u0p0g1h1a1b3',
    description: 'Unique identifier for the comment',
  })
  id: string;

  @ApiProperty({ example: 'Great post!' })
  content: string;

  @ApiProperty({ example: '2023-10-27T10:05:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T12:05:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'John Doe', required: false, nullable: true })
  author: string | null;

  @ApiProperty({ example: 5, default: 0 })
  likes: number;

  @ApiProperty({
    type: () => UserSummaryEntity,
    description: 'Author of the comment',
  })
  user: UserSummaryEntity;

  constructor(partial: Partial<BlogCommentEntity & { user: PrismaUser }>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserSummaryEntity(partial.user);
    }
  }
}
