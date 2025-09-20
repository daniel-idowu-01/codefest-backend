import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { EmergencyContact } from './entities/contact.entity';

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
  findAll(): Promise<EmergencyContact[]> {
    return this.contactsService.findAll();
  }

  @Get('by-state')
  @ApiOperation({ summary: 'Get contacts by state' })
  @ApiQuery({ name: 'state', description: 'State name', example: 'Lagos' })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
    type: [EmergencyContact],
  })
  findByState(@Query('state') state: string): Promise<EmergencyContact[]> {
    return this.contactsService.findByState(state);
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
  findByType(@Query('type') type: string): Promise<EmergencyContact[]> {
    return this.contactsService.findByType(type);
  }

  @Get('24-hours')
  @ApiOperation({ summary: 'Get 24-hour available contacts' })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
    type: [EmergencyContact],
  })
  find24HourContacts(): Promise<EmergencyContact[]> {
    return this.contactsService.find24HourContacts();
  }
}
