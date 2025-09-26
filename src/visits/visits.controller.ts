import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Visit } from './entities/visit.entity';
import { SuccessResponseObject, ErrorResponseObject } from 'src/shared/https';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new antenatal visit record' })
  @ApiResponse({
    status: 201,
    description: 'Visit created successfully',
    type: Visit,
  })
  async create(@Body() createVisitDto: CreateVisitDto) {
    try {
      const response = await this.visitsService.create(createVisitDto);
      return new SuccessResponseObject('Visit created successfully', response);
    } catch (error) {
      ErrorResponseObject('Failed to create visit', error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all visits or filter by date range' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Visits retrieved successfully',
    type: [Visit],
  })
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      let response: any;
      if (startDate && endDate) {
        response = await this.visitsService.findByDateRange(startDate, endDate);
      } else {
        response = this.visitsService.findAll();
      }

      return new SuccessResponseObject(
        'Contacts fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch visits', error);
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get visit statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    try {
      const response = await this.visitsService.getVisitStats();
      return new SuccessResponseObject('Visit stats successfully', response);
    } catch (error) {
      ErrorResponseObject('Failed to fetch visit stat', error);
    }
  }

  @Get('reminders')
  @ApiOperation({ summary: 'Get upcoming visit reminders' })
  @ApiResponse({
    status: 200,
    description: 'Reminders retrieved successfully',
    type: [Visit],
  })
  async getUpcomingReminders() {
    try {
      const response = await this.visitsService.getUpcomingReminders();
      return new SuccessResponseObject(
        'Visit reminders  fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch visit reminders', error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific visit by ID' })
  @ApiResponse({ status: 200, description: 'Visit found', type: Visit })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.visitsService.findOne(id);
      return new SuccessResponseObject(
        'Visit details fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch visit details', error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a visit record' })
  @ApiResponse({
    status: 200,
    description: 'Visit updated successfully',
    type: Visit,
  })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ) {
    try {
      const response = await this.visitsService.update(id, updateVisitDto);
      return new SuccessResponseObject(
        'Visit record updated successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to update visit record', error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visit record' })
  @ApiResponse({ status: 200, description: 'Visit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async remove(@Param('id') id: string) {
    try {
      const response = await this.visitsService.remove(id);
      return new SuccessResponseObject(
        'Visit record removed successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to remove visit record', error);
    }
  }
}
