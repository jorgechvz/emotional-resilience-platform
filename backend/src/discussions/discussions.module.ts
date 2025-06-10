import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DiscussionsController],
  providers: [DiscussionsService, PrismaService],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
