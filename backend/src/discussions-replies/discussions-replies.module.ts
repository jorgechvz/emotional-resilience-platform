import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; // Si es necesario para GetUser
import { DiscussionRepliesController } from './discussions-replies.controller';
import { DiscussionRepliesService } from './discussions-replies.service';

@Module({
  imports: [AuthModule],
  controllers: [DiscussionRepliesController],
  providers: [DiscussionRepliesService, PrismaService],
  exports: [DiscussionRepliesService],
})
export class DiscussionRepliesModule {}