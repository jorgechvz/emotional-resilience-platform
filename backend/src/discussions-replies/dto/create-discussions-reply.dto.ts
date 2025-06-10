import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateDiscussionReplyDto {
  @ApiProperty({
    example: 'Esta es mi respuesta al tema.',
    description: 'The content of the reply.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'discussion_id_example',
    description: 'The ID of the discussion this reply belongs to. Required if parentReplyId is not provided or for clarity.',
  })
  @IsNotEmpty()
  @IsMongoId()
  discussionId: string;

  @ApiProperty({
    example: 'parent_reply_id_example',
    description: 'The ID of the parent reply if this is a nested reply. If null, it is a direct reply to the discussion.',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  parentReplyId?: string;
}