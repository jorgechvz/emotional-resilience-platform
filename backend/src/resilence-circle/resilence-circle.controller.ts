import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { ResilienceCirclesService } from './resilence-circle.service';
import { CreateResilienceCircleDto } from './dto/create-resilence-circle.dto';
import { ResilienceCircleEntity } from './entities/resilence-circle.entity';
import { UpdateResilienceCircleDto } from './dto/update-resilence-circle.dto';

@ApiTags('Resilience Circles')
@Controller('resilience-circles')
export class ResilienceCirclesController {
  constructor(
    private readonly resilienceCirclesService: ResilienceCirclesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new resilience circle (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Resilience circle created successfully.',
    type: ResilienceCircleEntity,
  })
  async create(
    @Body() createResilienceCircleDto: CreateResilienceCircleDto,
    @GetUser() currentUser: PrismaUser,
  ): Promise<ResilienceCircleEntity> {
    const circle = await this.resilienceCirclesService.create(
      createResilienceCircleDto,
      currentUser,
    );
    return new ResilienceCircleEntity(circle as any);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resilience circles with pagination' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of records to take',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'e.g., createdAt_asc or name_desc',
  })
  @ApiResponse({
    status: 200,
    description: 'List of resilience circles.',
    type: [ResilienceCircleEntity],
  })
  async findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
    @Query('orderBy') orderBy?: string,
  ): Promise<ResilienceCircleEntity[]> {
    let orderByCondition;
    if (orderBy) {
      const [field, direction] = orderBy.split('_');
      orderByCondition = { [field]: direction };
    }
    const circles = await this.resilienceCirclesService.findAll({
      skip,
      take,
      orderBy: orderByCondition,
    });
    return circles.map((circle) => new ResilienceCircleEntity(circle as any));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resilience circle by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the resilience circle',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resilience circle details.',
    type: ResilienceCircleEntity,
  })
  @ApiResponse({ status: 404, description: 'Resilience circle not found.' })
  async findOne(@Param('id') id: string): Promise<ResilienceCircleEntity> {
    const circle = await this.resilienceCirclesService.findOne(id);
    return new ResilienceCircleEntity(circle as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a resilience circle (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'ID of the resilience circle to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resilience circle updated successfully.',
    type: ResilienceCircleEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateResilienceCircleDto: UpdateResilienceCircleDto,
    @GetUser() currentUser: PrismaUser,
  ): Promise<ResilienceCircleEntity> {
    const circle = await this.resilienceCirclesService.update(
      id,
      updateResilienceCircleDto,
      currentUser,
    );
    return new ResilienceCircleEntity(circle as any);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a resilience circle (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'ID of the resilience circle to delete',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Resilience circle deleted successfully.',
  })
  async remove(
    @Param('id') id: string,
    @GetUser() currentUser: PrismaUser,
  ): Promise<void> {
    await this.resilienceCirclesService.remove(id, currentUser);
  }
}
