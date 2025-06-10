import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChapterNotesController } from './chapters-notes.controller';
import { ChapterNotesService } from './chapters-notes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChapterNotesController],
  providers: [ChapterNotesService, PrismaService],
  exports: [ChapterNotesService],
})
export class ChapterNotesModule {}
