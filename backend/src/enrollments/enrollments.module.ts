import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import {
  EnrollmentsController,
  AdminEnrollmentsController,
} from './enrollments.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; // Si GetUser o Guards son de AuthModule

@Module({
  imports: [AuthModule],
  controllers: [EnrollmentsController, AdminEnrollmentsController],
  providers: [EnrollmentsService, PrismaService],
  exports: [EnrollmentsService], // Exportar si otros servicios necesitan verificar inscripciones
})
export class EnrollmentsModule {}
