import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ChapterProgressController,
  UserCourseProgressController,
} from './chapters-progress.controller';
import { ChapterProgressService } from './chapters-progress.service';
import { AuthModule } from '../auth/auth.module'; // Si GetUser es de AuthModule

@Module({
  imports: [AuthModule],
  controllers: [ChapterProgressController, UserCourseProgressController],
  providers: [ChapterProgressService, PrismaService],
  exports: [ChapterProgressService],
})
export class ChapterProgressModule {}
