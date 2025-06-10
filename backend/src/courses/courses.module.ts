import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaService } from '../prisma.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService],
  exports: [CoursesService],
})
export class CoursesModule {}
