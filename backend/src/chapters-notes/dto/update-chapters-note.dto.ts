import { PartialType } from '@nestjs/swagger';
import { CreateChapterNoteDto } from './create-chapters-note.dto';

export class UpdateChapterNoteDto extends PartialType(CreateChapterNoteDto) {}