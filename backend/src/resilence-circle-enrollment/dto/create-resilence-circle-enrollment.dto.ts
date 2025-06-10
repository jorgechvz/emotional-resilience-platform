import { ApiPropertyOptional } from '@nestjs/swagger';
import { EnrollmentStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateResilienceCircleEnrollmentDto {
  @ApiPropertyOptional({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.CONFIRMED,
    description: 'Initial status of the enrollment',
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
