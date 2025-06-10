import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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
import { User as PrismaUser, Role, EnrollmentStatus } from '@prisma/client';
import { ResilienceCircleEnrollmentEntity } from './entities/resilence-circle-enrollment.entity';
import { ResilienceCircleEnrollmentsService } from './resilence-circle-enrollment.service';
import { CreateResilienceCircleEnrollmentDto } from './dto/create-resilence-circle-enrollment.dto';
import { UpdateResilienceCircleEnrollmentDto } from './dto/update-resilence-circle-enrollment.dto';

@ApiTags('Resilience Circle Enrollments')
@Controller()
export class ResilienceCircleEnrollmentsController {
  constructor(
    private readonly enrollmentsService: ResilienceCircleEnrollmentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('resilience-circles/:circleId/enrollments')
  @ApiOperation({ summary: 'Enroll the current user in a resilience circle' })
  @ApiParam({
    name: 'circleId',
    description: 'ID of the resilience circle to enroll in',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled.',
    type: ResilienceCircleEnrollmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Circle not found.' })
  @ApiResponse({
    status: 409,
    description: 'User already enrolled or enrollment conflict.',
  })
  @ApiResponse({ status: 400, description: 'Circle at maximum capacity.' })
  async enrollMe(
    @Param('circleId') circleId: string,
    @GetUser('id') userId: string,
    @Body() createDto: CreateResilienceCircleEnrollmentDto, // Puede estar vacío o tener status opcional
  ): Promise<ResilienceCircleEnrollmentEntity> {
    const enrollment = await this.enrollmentsService.create(
      userId,
      circleId,
      createDto,
    );
    return new ResilienceCircleEnrollmentEntity(enrollment as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('users/me/resilience-enrollments')
  @ApiOperation({ summary: "Get current user's resilience circle enrollments" })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, type: [ResilienceCircleEnrollmentEntity] })
  async getMyEnrollments(
    @GetUser('id') userId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<ResilienceCircleEnrollmentEntity[]> {
    const enrollments = await this.enrollmentsService.findAllByUser(userId, {
      skip,
      take,
    });
    return enrollments.map(
      (e) => new ResilienceCircleEnrollmentEntity(e as any),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('resilience-enrollments/:enrollmentId/cancel')
  @ApiOperation({ summary: "Cancel current user's enrollment" })
  @ApiParam({
    name: 'enrollmentId',
    description: 'ID of the enrollment to cancel',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment cancelled.',
    type: ResilienceCircleEnrollmentEntity,
  })
  async cancelMyEnrollment(
    @Param('enrollmentId') enrollmentId: string,
    @GetUser('id') userId: string,
  ): Promise<ResilienceCircleEnrollmentEntity> {
    const enrollment = await this.enrollmentsService.cancelMyEnrollment(
      enrollmentId,
      userId,
    );
    return new ResilienceCircleEnrollmentEntity(enrollment as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('resilience-circles/:circleId/enrollments')
  @ApiOperation({
    summary: 'Get all enrollments for a specific circle (Admin only)',
  })
  @ApiParam({
    name: 'circleId',
    description: 'ID of the resilience circle',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: EnrollmentStatus,
    description: 'Filter by enrollment status',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, type: [ResilienceCircleEnrollmentEntity] })
  async getEnrollmentsForCircle(
    @Param('circleId') circleId: string,
    @Query('status') status?: EnrollmentStatus,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<ResilienceCircleEnrollmentEntity[]> {
    const enrollments = await this.enrollmentsService.findAllByCircle(
      circleId,
      { status, skip, take },
    );
    return enrollments.map(
      (e) => new ResilienceCircleEnrollmentEntity(e as any),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('resilience-enrollments/:enrollmentId')
  @ApiOperation({ summary: 'Get a specific enrollment by ID (Admin only)' })
  @ApiParam({
    name: 'enrollmentId',
    description: 'ID of the enrollment',
    type: String,
  })
  @ApiResponse({ status: 200, type: ResilienceCircleEnrollmentEntity })
  async getEnrollmentById(
    @Param('enrollmentId') enrollmentId: string,
  ): Promise<ResilienceCircleEnrollmentEntity> {
    const enrollment = await this.enrollmentsService.findOne(enrollmentId);
    return new ResilienceCircleEnrollmentEntity(enrollment as any);
  }

  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @Patch('resilience-enrollments/:enrollmentId/status')
  @ApiOperation({ summary: "Update an enrollment's status (Admin only)" })
  @ApiParam({
    name: 'enrollmentId',
    description: 'ID of the enrollment to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment status updated.',
    type: ResilienceCircleEnrollmentEntity,
  })
  async updateEnrollmentStatus(
    @Param('enrollmentId') enrollmentId: string,
    @Body() updateDto: UpdateResilienceCircleEnrollmentDto,
    @GetUser() currentUser: PrismaUser,
  ): Promise<ResilienceCircleEnrollmentEntity> {
    const enrollment = await this.enrollmentsService.updateStatus(
      enrollmentId,
      updateDto,
      currentUser,
    );
    return new ResilienceCircleEnrollmentEntity(enrollment as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('resilience-enrollments/:enrollmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an enrollment (Admin only)' })
  @ApiParam({
    name: 'enrollmentId',
    description: 'ID of the enrollment to delete',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Enrollment deleted successfully.' })
  async deleteEnrollment(
    @Param('enrollmentId') enrollmentId: string,
    @GetUser() currentUser: PrismaUser,
  ): Promise<void> {
    await this.enrollmentsService.remove(enrollmentId, currentUser);
  }
}
