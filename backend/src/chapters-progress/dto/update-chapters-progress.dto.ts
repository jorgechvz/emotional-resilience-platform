import { PartialType } from '@nestjs/swagger';
import { CreateChaptersProgressDto } from './create-chapters-progress.dto';

export class UpdateChaptersProgressDto extends PartialType(CreateChaptersProgressDto) {}
