import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @Exclude() 
  password!: string;

  @ApiProperty({ required: false, nullable: true })
  firstName?: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastName?: string | null;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ required: false, nullable: true })
  lastLogin?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
