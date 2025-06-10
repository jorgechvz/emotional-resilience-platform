import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CircleType,
  ResilienceCircle as PrismaResilienceCircle,
  ResilienceCircleEnrollment as PrismaResilienceCircleEnrollment,
  User as PrismaUser,
} from '@prisma/client';
import { ResilienceCircleEnrollmentEntity } from 'src/resilence-circle-enrollment/entities/resilence-circle-enrollment.entity';

export class ResilienceCircleEntity
  implements Omit<PrismaResilienceCircle, 'enrolledUsers'>
{
  @ApiProperty({
    example: 'clqj4i5x00000u0p0g1h1a1b1',
    description: 'Unique identifier for the resilience circle',
  })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  dateDescription: string;

  @ApiProperty()
  timeDescription: string;

  @ApiProperty({ enum: CircleType })
  type: CircleType;

  @ApiProperty()
  focus: string;

  @ApiProperty()
  facilitator: string;

  @ApiProperty()
  participants: number;

  @ApiProperty()
  maxParticipants: number;

  @ApiPropertyOptional({ nullable: true })
  rating: number | null;

  @ApiPropertyOptional({ nullable: true })
  distance: number | null;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiPropertyOptional({ nullable: true })
  latitude: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude: number | null;

  @ApiPropertyOptional({ name: 'imageUrl', nullable: true })
  imageUrl: string | null;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({
    type: () => [ResilienceCircleEnrollmentEntity],
    description: 'List of enrollments for this circle',
  })
  enrolledUsers?: ResilienceCircleEnrollmentEntity[];

  @ApiPropertyOptional({
    description: 'Count of enrolled users with CONFIRMED status',
  })
  confirmedParticipantsCount?: number;

  constructor(
    partial: Partial<
      PrismaResilienceCircle & {
        enrolledUsers?: (PrismaResilienceCircleEnrollment & {
          user: PrismaUser;
        })[];
        _count?: { enrolledUsers: number };
      }
    >,
  ) {
    Object.assign(this, partial);
    if (partial.enrolledUsers) {
      this.enrolledUsers = partial.enrolledUsers.map(
        (enrollment) => new ResilienceCircleEnrollmentEntity(enrollment),
      );
    }
    // Si _count.enrolledUsers se usa para un conteo específico (ej. solo confirmados), se manejaría en el servicio.
    // Aquí, 'participants' del modelo Prisma ya es un Int.
    // Si quieres un conteo dinámico de confirmados, lo calcularías en el servicio y lo añadirías.
  }
}
