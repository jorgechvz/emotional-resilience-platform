import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ResilienceCirclesModule } from 'src/resilence-circle/resilence-circle.module';
import { ResilienceCircleEnrollmentsController } from './resilence-circle-enrollment.controller';
import { ResilienceCircleEnrollmentsService } from './resilence-circle-enrollment.service';

@Module({
  imports: [
    AuthModule, 
    forwardRef(() => ResilienceCirclesModule), 
  ],
  controllers: [ResilienceCircleEnrollmentsController],
  providers: [ResilienceCircleEnrollmentsService, PrismaService],
  exports: [ResilienceCircleEnrollmentsService],
})
export class ResilienceCircleEnrollmentsModule {}
