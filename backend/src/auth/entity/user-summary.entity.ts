import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';

export class UserSummaryEntity {
  @ApiProperty({
    example: 'clqj4i5x00000u0p0g1h1a1b1',
    description: 'Unique identifier for the user',
  })
  id: string;

  @ApiProperty({ example: 'John', required: false, nullable: true })
  firstName?: string | null;

  @ApiProperty({ example: 'Doe', required: false, nullable: true })
  lastName?: string | null;

  constructor(partial: Partial<PrismaUser>) {
    this.id = partial.id!;
    this.firstName = partial.firstName;
    this.lastName = partial.lastName;
  }
}
