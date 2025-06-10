import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateChaptersProgressDto {
  @ApiProperty({
    example: true,
    description: 'Whether the chapter is marked as completed by the user.',
  })
  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;
}