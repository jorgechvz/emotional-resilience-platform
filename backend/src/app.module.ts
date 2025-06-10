import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { ChaptersModule } from './chapters/chapters.module';
import { ChapterProgressModule } from './chapters-progress/chapters-progress.module';
import { ChapterNotesModule } from './chapters-notes/chapters-notes.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { DiscussionRepliesModule } from './discussions-replies/discussions-replies.module';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { BlogCommentsModule } from './blog-comments/blog-comments.module';
import { ResilienceCircleEnrollmentsModule } from './resilence-circle-enrollment/resilence-circle-enrollment.module';
import { ResilienceCirclesModule } from './resilence-circle/resilence-circle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    CoursesModule,
    ChaptersModule,
    ChapterProgressModule,
    ChapterNotesModule,
    EnrollmentsModule,
    DiscussionsModule,
    DiscussionRepliesModule,
    BlogPostsModule,
    BlogCommentsModule,
    ResilienceCirclesModule,
    ResilienceCircleEnrollmentsModule,
  ],
})
export class AppModule {}
