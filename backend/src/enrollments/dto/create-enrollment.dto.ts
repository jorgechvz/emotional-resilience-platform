import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({
    example: 'course_id_example',
    description: 'The ID of the course to enroll in.',
  })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}
