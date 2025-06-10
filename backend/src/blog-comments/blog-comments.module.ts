import { Module } from '@nestjs/common';
import { BlogCommentsService } from './blog-comments.service';
import { BlogCommentsController } from './blog-comments.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BlogCommentsController],
  providers: [BlogCommentsService, PrismaService],
  exports: [BlogCommentsService],
})
export class BlogCommentsModule {}
