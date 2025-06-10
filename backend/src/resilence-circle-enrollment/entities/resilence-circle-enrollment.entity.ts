import { ApiProperty } from '@nestjs/swagger';
import {
  ResilienceCircleEnrollment as PrismaResilienceCircleEnrollment,
  User as PrismaUser,
  ResilienceCircle as PrismaResilienceCircle,
  EnrollmentStatus,
} from '@prisma/client';
import { UserSummaryEntity } from 'src/discussions/entities/user-summary.entity';
import { ResilienceCircleSummaryEntity } from 'src/resilence-circle/entities/resilence-circle-summary.entity';

export class ResilienceCircleEnrollmentEntity
  implements
    Omit<
      PrismaResilienceCircleEnrollment,
      'userId' | 'circleId' | 'user' | 'circle'
    >
{
  @ApiProperty({
    example: 'clqj4i5x00001u0p0g1h1a1b2',
    description: 'Unique identifier for the enrollment',
  })
  id: string;

  @ApiProperty()
  enrolledAt: Date;

  @ApiProperty({ enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @ApiProperty({ type: () => UserSummaryEntity })
  user: UserSummaryEntity;

  @ApiProperty({ type: () => ResilienceCircleSummaryEntity })
  circle: ResilienceCircleSummaryEntity;

  constructor(
    partial: Partial<
      PrismaResilienceCircleEnrollment & {
        user: PrismaUser;
        circle: PrismaResilienceCircle;
      }
    >,
  ) {
    this.id = partial.id!;
    this.enrolledAt = partial.enrolledAt!;
    this.status = partial.status as EnrollmentStatus;
    if (partial.user) {
      this.user = new UserSummaryEntity(partial.user);
    }
    if (partial.circle) {
      this.circle = new ResilienceCircleSummaryEntity(partial.circle);
    }
  }
}
