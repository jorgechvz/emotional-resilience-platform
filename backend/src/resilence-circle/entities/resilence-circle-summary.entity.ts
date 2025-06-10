import { ApiProperty } from "@nestjs/swagger";
import { ResilienceCircle as PrismaResilienceCircle } from "@prisma/client";

export class ResilienceCircleSummaryEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  dateDescription: string;
  @ApiProperty()
  timeDescription: string;

  constructor(partial: Partial<PrismaResilienceCircle>) {
    this.id = partial.id!;
    this.name = partial.name!;
    this.dateDescription = partial.dateDescription!;
    this.timeDescription = partial.timeDescription!;
  }
}