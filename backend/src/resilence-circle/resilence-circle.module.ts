import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ResilienceCirclesController } from './resilence-circle.controller';
import { ResilienceCirclesService } from './resilence-circle.service';

@Module({
  imports: [AuthModule],
  controllers: [ResilienceCirclesController],
  providers: [ResilienceCirclesService, PrismaService],
  exports: [ResilienceCirclesService],
})
export class ResilienceCirclesModule {}
