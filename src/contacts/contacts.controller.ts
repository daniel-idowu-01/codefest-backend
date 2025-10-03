import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { EmergencyContact } from './schema/contact.schema';
import { SuccessResponseObject, ErrorResponseObject } from 'src/shared/https';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all emergency contacts' })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
    type: [EmergencyContact],
  })
  async findAll() {
    try {
      const response = await this.contactsService.findAll();
      return new SuccessResponseObject(
        'Contacts fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch contacts', error);
    }
  }

  @Get('by-state')
  @ApiOperation({ summary: 'Get contacts by state' })
  @ApiQuery({ name: 'state', description: 'State name', example: 'Lagos' })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
    type: [EmergencyContact],
  })
  async findByState(@Query('state') state: string) {
    try {
      const response = await this.contactsService.findByState(state);
      return new SuccessResponseObject(
        'Contacts by state fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch contact by state', error);
    }
  }

  @Get('by-type')
  @ApiOperation({ summary: 'Get contacts by type' })
  @ApiQuery({
    name: 'type',
    description: 'Contact type',
    example: 'Teaching Hospital',
  })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
    type: [EmergencyContact],
  })
  async findByType(@Query('type') type: string) {
    try {
      const response = await this.contactsService.findByType(type);
      return new SuccessResponseObject(
        'Contacts by type fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch contact by type', error);
    }
  }

  @Get('24-hours')
  @ApiOperation({ summary: 'Get 24-hour available contacts' })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
    type: [EmergencyContact],
  })
  async find24HourContacts() {
    try {
      const response = await this.contactsService.find24HourContacts();
      return new SuccessResponseObject(
        '24 hours availiable contacts fetched successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to fetch 24 hours availiable contacts', error);
    }
  }
}
