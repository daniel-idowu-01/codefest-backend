import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Visit } from './entities/visit.entity';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new antenatal visit record' })
  @ApiResponse({ status: 201, description: 'Visit created successfully', type: Visit })
  create(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
    return this.visitsService.create(createVisitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all visits or filter by date range' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Visits retrieved successfully', type: [Visit] })
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Visit[]> {
    if (startDate && endDate) {
      return this.visitsService.findByDateRange(startDate, endDate);
    }
    return this.visitsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get visit statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats() {
    return this.visitsService.getVisitStats();
  }

  @Get('reminders')
  @ApiOperation({ summary: 'Get upcoming visit reminders' })
  @ApiResponse({ status: 200, description: 'Reminders retrieved successfully', type: [Visit] })
  getUpcomingReminders(): Promise<Visit[]> {
    return this.visitsService.getUpcomingReminders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific visit by ID' })
  @ApiResponse({ status: 200, description: 'Visit found', type: Visit })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  findOne(@Param('id') id: string): Promise<Visit> {
    return this.visitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a visit record' })
  @ApiResponse({ status: 200, description: 'Visit updated successfully', type: Visit })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  update(
    @Param('id') id: string, 
    @Body() updateVisitDto: UpdateVisitDto
  ): Promise<Visit> {
    return this.visitsService.update(id, updateVisitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visit record' })
  @ApiResponse({ status: 200, description: 'Visit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.visitsService.remove(id);
  }
}