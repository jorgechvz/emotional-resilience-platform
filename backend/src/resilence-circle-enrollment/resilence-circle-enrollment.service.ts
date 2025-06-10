import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ResilienceCircleEnrollment,
  Prisma,
  User as PrismaUser,
  EnrollmentStatus,
} from '@prisma/client';
import { ResilienceCirclesService } from 'src/resilence-circle/resilence-circle.service';
import { CreateResilienceCircleEnrollmentDto } from './dto/create-resilence-circle-enrollment.dto';
import { UpdateResilienceCircleEnrollmentDto } from './dto/update-resilence-circle-enrollment.dto';

@Injectable()
export class ResilienceCircleEnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private resilienceCirclesService: ResilienceCirclesService,
  ) {}

  private getCommonInclude() {
    return {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      circle: {
        select: {
          id: true,
          name: true,
          dateDescription: true,
          timeDescription: true,
        },
      },
    };
  }

  async create(
    userId: string,
    circleId: string,
    createDto: CreateResilienceCircleEnrollmentDto,
  ): Promise<ResilienceCircleEnrollment> {
    const circle = await this.prisma.resilienceCircle.findUnique({
      where: { id: circleId },
    });
    if (!circle) {
      throw new NotFoundException(
        `Resilience Circle with ID "${circleId}" not found.`,
      );
    }

    const existingEnrollment =
      await this.prisma.resilienceCircleEnrollment.findUnique({
        where: { userId_circleId: { userId, circleId } },
      });

    if (existingEnrollment) {
      if (existingEnrollment.status === EnrollmentStatus.CANCELLED) {
        // Permitir re-matricularse si estaba cancelado
        const updatedEnrollment =
          await this.prisma.resilienceCircleEnrollment.update({
            where: { id: existingEnrollment.id },
            data: {
              status: createDto.status || EnrollmentStatus.CONFIRMED,
              enrolledAt: new Date(),
            },
            include: this.getCommonInclude(),
          });
        await this.resilienceCirclesService.updateParticipantsCount(circleId);
        return updatedEnrollment;
      }
      throw new ConflictException('User is already enrolled in this circle.');
    }

    // Verificar capacidad máxima
    const confirmedCount = await this.prisma.resilienceCircleEnrollment.count({
      where: { circleId, status: EnrollmentStatus.CONFIRMED },
    });
    if (confirmedCount >= circle.maxParticipants) {
      throw new BadRequestException(
        'This resilience circle has reached its maximum capacity.',
      );
    }

    const enrollment = await this.prisma.resilienceCircleEnrollment.create({
      data: {
        userId,
        circleId,
        status: createDto.status || EnrollmentStatus.CONFIRMED,
      },
      include: this.getCommonInclude(),
    });
    await this.resilienceCirclesService.updateParticipantsCount(circleId);
    return enrollment;
  }

  async findAllByUser(
    userId: string,
    params: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.ResilienceCircleEnrollmentOrderByWithRelationInput;
    },
  ): Promise<ResilienceCircleEnrollment[]> {
    return this.prisma.resilienceCircleEnrollment.findMany({
      where: { userId },
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy || { enrolledAt: 'desc' },
      include: this.getCommonInclude(),
    });
  }

  async findAllByCircle(
    circleId: string,
    params: {
      skip?: number;
      take?: number;
      status?: EnrollmentStatus;
      orderBy?: Prisma.ResilienceCircleEnrollmentOrderByWithRelationInput;
    },
  ): Promise<ResilienceCircleEnrollment[]> {
    return this.prisma.resilienceCircleEnrollment.findMany({
      where: {
        circleId,
        ...(params.status && { status: params.status }),
      },
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy || { enrolledAt: 'desc' },
      include: this.getCommonInclude(),
    });
  }

  async findOne(id: string): Promise<ResilienceCircleEnrollment | null> {
    const enrollment = await this.prisma.resilienceCircleEnrollment.findUnique({
      where: { id },
      include: this.getCommonInclude(),
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID "${id}" not found`);
    }
    return enrollment;
  }

  async updateStatus(
    enrollmentId: string,
    updateDto: UpdateResilienceCircleEnrollmentDto,
    currentUser: PrismaUser,
  ): Promise<ResilienceCircleEnrollment> {
    const enrollment = await this.prisma.resilienceCircleEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID "${enrollmentId}" not found.`,
      );
    }

    if (enrollment.userId !== currentUser.id) {
      if (
        !(
          updateDto.status === EnrollmentStatus.CANCELLED &&
          enrollment.userId === currentUser.id
        )
      ) {
        throw new ForbiddenException(
          'You do not have permission to update this enrollment status.',
        );
      }
    }

    const updatedEnrollment =
      await this.prisma.resilienceCircleEnrollment.update({
        where: { id: enrollmentId },
        data: { status: updateDto.status },
        include: this.getCommonInclude(),
      });
    await this.resilienceCirclesService.updateParticipantsCount(
      enrollment.circleId,
    );
    return updatedEnrollment;
  }

  async cancelMyEnrollment(
    enrollmentId: string,
    userId: string,
  ): Promise<ResilienceCircleEnrollment> {
    const enrollment = await this.prisma.resilienceCircleEnrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID "${enrollmentId}" not found.`,
      );
    }
    if (enrollment.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own enrollments.');
    }
    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new ConflictException('Enrollment is already cancelled.');
    }

    const updatedEnrollment =
      await this.prisma.resilienceCircleEnrollment.update({
        where: { id: enrollmentId },
        data: { status: EnrollmentStatus.CANCELLED },
        include: this.getCommonInclude(),
      });
    await this.resilienceCirclesService.updateParticipantsCount(
      enrollment.circleId,
    );
    return updatedEnrollment;
  }

  async remove(
    enrollmentId: string,
    currentUser: PrismaUser,
  ): Promise<ResilienceCircleEnrollment> {
    const enrollment = await this.prisma.resilienceCircleEnrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID "${enrollmentId}" not found.`,
      );
    }
    if (enrollment.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this enrollment.',
      );
    }
    const deletedEnrollment =
      await this.prisma.resilienceCircleEnrollment.delete({
        where: { id: enrollmentId },
      });
    await this.resilienceCirclesService.updateParticipantsCount(
      enrollment.circleId,
    );
    return deletedEnrollment;
  }
}
