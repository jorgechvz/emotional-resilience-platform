import { Module } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { BlogPostsController } from './blog-posts.controller';
import { PrismaService } from '../prisma.service';
import { BlogCommentsModule } from '../blog-comments/blog-comments.module'; 

@Module({
  imports: [BlogCommentsModule], 
  controllers: [BlogPostsController],
  providers: [BlogPostsService, PrismaService],
  exports: [BlogPostsService],
})
export class BlogPostsModule {}