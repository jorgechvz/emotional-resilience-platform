import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ResilienceCircle,
  Prisma,
  User as PrismaUser,
  EnrollmentStatus,
} from '@prisma/client';
import { CreateResilienceCircleDto } from './dto/create-resilence-circle.dto';
import { UpdateResilienceCircleDto } from './dto/update-resilence-circle.dto';

@Injectable()
export class ResilienceCirclesService {
  constructor(private prisma: PrismaService) {}

  private getCommonInclude() {
    return {
      enrolledUsers: {
        where: { status: EnrollmentStatus.CONFIRMED },
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    };
  }

  async create(
    createResilienceCircleDto: CreateResilienceCircleDto,
    currentUser?: PrismaUser,
  ): Promise<ResilienceCircle> {
    return this.prisma.resilienceCircle.create({
      data: {
        ...createResilienceCircleDto,
        description: createResilienceCircleDto.description || '',
      },
      include: this.getCommonInclude(),
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ResilienceCircleWhereUniqueInput;
    where?: Prisma.ResilienceCircleWhereInput;
    orderBy?: Prisma.ResilienceCircleOrderByWithRelationInput;
  }): Promise<ResilienceCircle[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.resilienceCircle.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: this.getCommonInclude(),
    });
  }

  async findOne(
    id: string,
  ): Promise<
    (ResilienceCircle & { confirmedParticipantsCount?: number }) | null
  > {
    const circle = await this.prisma.resilienceCircle.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrolledUsers: {
              where: { status: EnrollmentStatus.CONFIRMED },
            },
          },
        },
      },
    });
    if (!circle) {
      throw new NotFoundException(
        `Resilience Circle with ID "${id}" not found`,
      );
    }
    const confirmedParticipantsCount = circle._count?.enrolledUsers;
    const { _count, ...circleData } = circle;

    return { ...circleData, confirmedParticipantsCount };
  }

  async update(
    id: string,
    updateResilienceCircleDto: UpdateResilienceCircleDto,
    currentUser?: PrismaUser,
  ): Promise<ResilienceCircle> {
    const circle = await this.prisma.resilienceCircle.findUnique({
      where: { id },
    });
    if (!circle) {
      throw new NotFoundException(
        `Resilience Circle with ID "${id}" not found`,
      );
    }

    return this.prisma.resilienceCircle.update({
      where: { id },
      data: updateResilienceCircleDto,
      include: this.getCommonInclude(),
    });
  }

  async remove(
    id: string,
    currentUser?: PrismaUser,
  ): Promise<ResilienceCircle> {
    const circle = await this.prisma.resilienceCircle.findUnique({
      where: { id },
    });
    if (!circle) {
      throw new NotFoundException(
        `Resilience Circle with ID "${id}" not found`,
      );
    }
    return this.prisma.resilienceCircle.delete({
      where: { id },
    });
  }

  async updateParticipantsCount(circleId: string): Promise<void> {
    const confirmedCount = await this.prisma.resilienceCircleEnrollment.count({
      where: {
        circleId: circleId,
        status: EnrollmentStatus.CONFIRMED,
      },
    });
    await this.prisma.resilienceCircle.update({
      where: { id: circleId },
      data: { participants: confirmedCount },
    });
  }
}
