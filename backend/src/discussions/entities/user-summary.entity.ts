import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryEntity {
  @ApiProperty({
    example: 'user_id_example',
    description: "User's unique identifier",
  })
  id: string;

  @ApiProperty({
    example: 'John',
    required: false,
    description: "User's first name",
  })
  firstName?: string | null;

  @ApiProperty({
    example: 'Doe',
    required: false,
    description: "User's last name",
  })
  lastName?: string | null;


  constructor(partial: Partial<UserSummaryEntity>) {
    Object.assign(this, partial);
  }
}
