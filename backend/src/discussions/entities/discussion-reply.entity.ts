import { ApiProperty } from '@nestjs/swagger';
import { DiscussionReply as PrismaDiscussionReply, User } from '@prisma/client';
import { UserSummaryEntity } from './user-summary.entity';

export class DiscussionReplyEntity
  implements
    Omit<PrismaDiscussionReply, 'userId' | 'discussionId' | 'parentReplyId'>
{
  @ApiProperty({
    example: 'clqj4i5x00006u0p0g1h1a1b7',
    description: 'Unique identifier for the reply',
  })
  id: string;

  @ApiProperty({
    example: 'Estoy de acuerdo con este punto.',
    description: 'Content of the reply',
  })
  content: string;

  @ApiProperty({
    example: '2023-01-20T10:05:00.000Z',
    description: 'Timestamp when the reply was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-20T11:05:00.000Z',
    description: 'Timestamp of the last update',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => UserSummaryEntity,
    description: 'The user who wrote the reply',
  })
  user: UserSummaryEntity;

  @ApiProperty({
    example: 'discussion_id_example',
    description: 'ID of the discussion this reply belongs to',
  })
  discussionId: string;

  @ApiProperty({
    example: 'parent_reply_id_example',
    required: false,
    nullable: true,
    description: 'ID of the parent reply if this is a nested reply',
  })
  parentReplyId: string | null;

  @ApiProperty({
    type: () => [DiscussionReplyEntity],
    required: false,
    description: 'Child replies to this reply (loaded on demand)',
  })
  childReplies?: DiscussionReplyEntity[]; // Para cuando se cargan explícitamente

  @ApiProperty({
    example: 3,
    required: false,
    description: 'Number of direct child replies to this reply',
  })
  childRepliesCount?: number;

  constructor(
    partial: Partial<
      DiscussionReplyEntity & { user: User; _count?: { childReplies?: number } }
    >,
  ) {
    this.id = partial.id!;
    this.content = partial.content!;
    this.createdAt = partial.createdAt!;
    this.updatedAt = partial.updatedAt!;
    this.discussionId = partial.discussionId!;
    this.parentReplyId = partial.parentReplyId ?? null;

    if (partial.user) {
      this.user = new UserSummaryEntity(partial.user);
    }
    if (partial.childReplies) {
      // Si se cargan explícitamente
      this.childReplies = partial.childReplies.map(
        (reply) => new DiscussionReplyEntity(reply as any),
      );
    }
    if (partial._count?.childReplies !== undefined) {
      this.childRepliesCount = partial._count.childReplies;
    }
  }
}
