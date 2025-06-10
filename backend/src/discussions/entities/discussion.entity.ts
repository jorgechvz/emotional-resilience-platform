import { ApiProperty } from '@nestjs/swagger';
import { Discussion as PrismaDiscussion, User, Chapter } from '@prisma/client';
import { UserSummaryEntity } from './user-summary.entity';
import { DiscussionReplyEntity } from './discussion-reply.entity';

export class DiscussionEntity
  implements Omit<PrismaDiscussion, 'userId' | 'chapterId'>
{
  @ApiProperty({
    example: 'clqj4h5x00005u0p0g1h1a1b6',
    description: 'Unique identifier for the discussion',
  })
  id: string;

  @ApiProperty({
    example: '¿Cómo aplicar el principio de la gratitud?',
    description: 'Title of the discussion',
  })
  title: string;

  @ApiProperty({
    example: 'Me gustaría saber cómo...',
    description: 'Content of the discussion',
  })
  content: string;

  @ApiProperty({
    example: '2023-01-20T10:00:00.000Z',
    description: 'Timestamp when the discussion was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-20T11:00:00.000Z',
    description: 'Timestamp of the last update',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => UserSummaryEntity,
    description: 'The user who started the discussion',
  })
  user: UserSummaryEntity; // Relación con User

  @ApiProperty({
    example: 'chapter_id_example',
    description: 'ID of the chapter this discussion belongs to',
  })
  chapterId: string; // Mantener el ID del capítulo

  @ApiProperty({
    type: () => [DiscussionReplyEntity],
    required: false,
    description: 'Replies to this discussion',
  })
  replies?: DiscussionReplyEntity[]; // Relación con DiscussionReply

  @ApiProperty({
    example: 5,
    required: false,
    description: 'Total count of replies to this discussion',
  })
  repliesCount?: number;

  constructor(
    partial: Partial<
      DiscussionEntity & {
        user: User;
        chapter: Chapter;
        _count?: { replies?: number };
      }
    >,
  ) {
    this.id = partial.id!;
    this.title = partial.title!;
    this.content = partial.content!;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
    this.chapterId = partial.chapterId!; // Asignar chapterId

    if (partial.user) {
      this.user = new UserSummaryEntity(partial.user);
    }
    if (partial.replies) {
      this.replies = partial.replies.map(
        (reply) => new DiscussionReplyEntity(reply as any),
      ); // Cast 'as any' if Prisma type differs slightly
    }
    if (partial._count?.replies !== undefined) {
      this.repliesCount = partial._count.replies;
    }
  }
}
