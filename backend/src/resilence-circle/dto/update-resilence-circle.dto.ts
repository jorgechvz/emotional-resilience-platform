import { ApiPropertyOptional } from '@nestjs/swagger';
import { CircleType } from '@prisma/client';
import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  IsNumber,
  Max,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';

export class UpdateResilienceCircleDto {
  @ApiPropertyOptional({
    example: 'Downtown Resilience Meetup',
    description: 'Name of the resilience circle',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Community Center Hall A',
    description: 'Location/Venue name',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: '123 Main St, Anytown, USA',
    description: 'Full address of the circle',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Every Wednesday',
    description: 'Description of when the circle meets',
  })
  @IsOptional()
  @IsString()
  dateDescription?: string;

  @ApiPropertyOptional({
    example: '7:00 PM - 8:30 PM',
    description: 'Time of the circle meetings',
  })
  @IsOptional()
  @IsString()
  timeDescription?: string;

  @ApiPropertyOptional({
    enum: CircleType,
    example: CircleType.IN_PERSON,
    description: 'Type of the circle meeting',
  })
  @IsOptional()
  @IsEnum(CircleType)
  type?: CircleType;

  @ApiPropertyOptional({
    example: 'Stress Management',
    description: 'Main focus or theme of the circle',
  })
  @IsOptional()
  @IsString()
  focus?: string;

  @ApiPropertyOptional({
    example: 'Dr. Jane Doe',
    description: 'Name of the facilitator',
  })
  @IsOptional()
  @IsString()
  facilitator?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Maximum number of participants allowed',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @ApiPropertyOptional({
    example: 4.5,
    description: 'Rating of the circle (0-5)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: 'A welcoming space to learn and share resilience techniques.',
    description: 'Detailed description of the circle',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['mindfulness', 'community', 'support'],
    type: [String],
    description: 'Tags associated with the circle',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: 40.7128,
    description: 'Latitude of the circle location',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: -74.006,
    description: 'Longitude of the circle location',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL of an image for the circle',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Is the circle featured?',
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
