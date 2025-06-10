import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class AuthTokensDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Access Token' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh Token' })
  refreshToken!: string;
}

export class SignInResponseDto extends AuthTokensDto {
  @ApiProperty({ description: 'User details' })
  user!: Omit<User, 'password' | 'sessions'>;
}