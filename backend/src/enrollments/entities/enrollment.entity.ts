import { ApiProperty } from '@nestjs/swagger';
import { Enrollment as PrismaEnrollment } from '@prisma/client';
import { CourseEntity } from '../../courses/entities/course.entity';
import { UserEntity } from 'src/auth/entity/users.entity';

export class EnrollmentEntity implements PrismaEnrollment {
  @ApiProperty({
    example: 'clqj4g5x00004u0p0g1h1a1b5',
    description: 'Unique identifier for the enrollment',
  })
  id: string;

  @ApiProperty({
    example: 'user_id_example',
    description: 'ID of the enrolled user',
  })
  userId: string;

  @ApiProperty({
    example: 'course_id_example',
    description: 'ID of the course',
  })
  courseId: string;

  @ApiProperty({
    example: '2023-01-15T10:00:00.000Z',
    description: 'Timestamp when the user enrolled',
  })
  enrolledAt: Date;

  @ApiProperty({
    example: '2023-02-15T10:00:00.000Z',
    required: false,
    nullable: true,
    description: 'Timestamp when the user completed the course',
  })
  completedAt: Date | null;

  @ApiProperty({
    type: () => UserEntity,
    required: false,
    description: 'Details of the enrolled user (if included)',
  })
  user?: UserEntity;

  @ApiProperty({
    type: () => CourseEntity,
    required: false,
    description: 'Details of the course (if included)',
  })
  course?: CourseEntity;

  constructor(partial: Partial<EnrollmentEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
    if (partial.course) {
      this.course = new CourseEntity(partial.course);
    }
  }
}
