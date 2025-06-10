import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateResilienceCircleEnrollmentDto {
  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.CANCELLED, description: 'New status for the enrollment' })
  @IsNotEmpty()
  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;
}