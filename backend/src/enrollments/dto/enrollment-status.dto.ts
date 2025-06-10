import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentStatusDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the user is enrolled in the course.',
  })
  enrolled: boolean;

  @ApiProperty({
    example: 'course_id_example',
    description: 'The ID of the course checked.',
  })
  courseId: string;
}
