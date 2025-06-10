import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User as PrismaUser, Role } from '@prisma/client';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EnrollmentStatusDto } from './dto/enrollment-status.dto';

@ApiTags('Enrollments (User-centric)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Enroll the current user in a course' })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled.',
    type: EnrollmentEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., missing courseId).',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (e.g., course not available).',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({
    status: 409,
    description: 'User already enrolled in this course.',
  })
  async create(
    @GetUser('id') userId: string,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentEntity> {
    const enrollment = await this.enrollmentsService.create(
      userId,
      createEnrollmentDto.courseId,
    );
    return new EnrollmentEntity(enrollment);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all courses the current user is enrolled in' })
  @ApiQuery({
    name: 'includeCourseDetails',
    required: false,
    type: Boolean,
    description: 'Whether to include full course details',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of user enrollments.',
    type: [EnrollmentEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAllByCurrentUser(
    @GetUser('id') userId: string,
    @Query('includeCourseDetails', new DefaultValuePipe(false), ParseBoolPipe)
    includeCourseDetails?: boolean,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<EnrollmentEntity[]> {
    const enrollments = await this.enrollmentsService.findAllByCurrentUser(
      userId,
      { includeCourseDetails, skip, take },
    );
    return enrollments.map((e) => new EnrollmentEntity(e));
  }

  @Get('course/:courseId/details')
  @ApiOperation({
    summary: 'Check if the current user is enrolled in a specific course',
  })
  @ApiParam({
    name: 'courseId',
    description: 'ID of the course to check enrollment status for',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment details if enrolled, null otherwise.',
    type: EnrollmentEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Course not found (if the course itself does not exist).',
  })
  async findOneByCurrentUserAndCourse(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<EnrollmentEntity | null> {
    const enrollment =
      await this.enrollmentsService.findOneByCurrentUserAndCourse(
        userId,
        courseId,
      );
    return enrollment ? new EnrollmentEntity(enrollment) : null;
  }

  @Get('course/:courseId/status')
  @ApiOperation({
    summary: 'Check if the current user is enrolled in a specific course',
  })
  @ApiParam({
    name: 'courseId',
    description: 'ID of the course to check enrollment status for',
  })
  @ApiResponse({
    status: 200,
    description: 'Provides the enrollment status of the user for the course.',
    type: EnrollmentStatusDto, // Cambiado de EnrollmentEntity a EnrollmentStatusDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Course not found (if the course itself does not exist).',
  })
  async findOneByCurrentUserAndCourseStatus(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<EnrollmentStatusDto> {
    const enrollment =
      await this.enrollmentsService.findOneByCurrentUserAndCourseStatus(
        userId,
        courseId,
      );
    return {
      enrolled: !!enrollment, 
      courseId: courseId,
    };
  }

  @Delete('course/:courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unenroll the current user from a specific course' })
  @ApiParam({
    name: 'courseId',
    description: 'ID of the course to unenroll from',
  })
  @ApiResponse({ status: 204, description: 'Successfully unenrolled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Enrollment not found.' })
  async removeByCurrentUserAndCourse(
    @GetUser('id') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<void> {
    await this.enrollmentsService.removeByCurrentUserAndCourse(
      userId,
      courseId,
    );
  }
}

@ApiTags('Enrollments (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/enrollments')
export class AdminEnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('course/:courseId')
  @ApiOperation({
    summary: 'Get all enrollments for a specific course (Admin only)',
  })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of enrollments for the course.',
    type: [EnrollmentEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async findAllByCourseForAdmin(
    @Param('courseId') courseId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<EnrollmentEntity[]> {
    const enrollments = await this.enrollmentsService.findAllByCourseForAdmin(
      courseId,
      { skip, take },
    );
    return enrollments.map((e) => new EnrollmentEntity(e));
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get all enrollments for a specific user (Admin only)',
  })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of enrollments for the user.',
    type: [EnrollmentEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findAllByUserForAdmin(
    @Param('userId') userId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<EnrollmentEntity[]> {
    const enrollments = await this.enrollmentsService.findAllByUserForAdmin(
      userId,
      { skip, take },
    );
    return enrollments.map((e) => new EnrollmentEntity(e));
  }

  @Delete(':enrollmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a specific enrollment by its ID (Admin only)',
  })
  @ApiParam({
    name: 'enrollmentId',
    description: 'ID of the enrollment to delete',
  })
  @ApiResponse({ status: 204, description: 'Successfully deleted enrollment.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enrollment not found.' })
  async removeByEnrollmentIdForAdmin(
    @Param('enrollmentId') enrollmentId: string,
  ): Promise<void> {
    await this.enrollmentsService.removeByEnrollmentIdForAdmin(enrollmentId);
  }
}
