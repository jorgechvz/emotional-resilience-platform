import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { PrismaService } from '../prisma.service';
// Import AuthModule if GetUser decorator or Guards are from there and need to be available
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // If GetUser or guards are used and provided by AuthModule
  controllers: [ChaptersController],
  providers: [ChaptersService, PrismaService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
