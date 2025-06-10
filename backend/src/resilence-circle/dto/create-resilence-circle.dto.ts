import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CircleType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
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

export class CreateResilienceCircleDto {
  @ApiProperty({
    example: 'Downtown Resilience Meetup',
    description: 'Name of the resilience circle',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Community Center Hall A',
    description: 'Location/Venue name',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'Full address of the circle',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'Every Wednesday',
    description: 'Description of when the circle meets',
  })
  @IsNotEmpty()
  @IsString()
  dateDescription: string;

  @ApiProperty({
    example: '7:00 PM - 8:30 PM',
    description: 'Time of the circle meetings',
  })
  @IsNotEmpty()
  @IsString()
  timeDescription: string;

  @ApiProperty({
    enum: CircleType,
    example: CircleType.IN_PERSON,
    description: 'Type of the circle meeting',
  })
  @IsEnum(CircleType)
  type: CircleType;

  @ApiProperty({
    example: 'Stress Management',
    description: 'Main focus or theme of the circle',
  })
  @IsNotEmpty()
  @IsString()
  focus: string;

  @ApiProperty({
    example: 'Dr. Jane Doe',
    description: 'Name of the facilitator',
  })
  @IsNotEmpty()
  @IsString()
  facilitator: string;

  @ApiProperty({
    example: 20,
    description: 'Maximum number of participants allowed',
  })
  @IsInt()
  @Min(1)
  maxParticipants: number;

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
