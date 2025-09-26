import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocationService, NearbyHospital } from './location.service';
import { NearbySearchDto, HospitalSearchDto } from './dto/nearby-search.dto';
import { SuccessResponseObject, ErrorResponseObject } from 'src/shared/https';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('nearby-hospitals')
  @ApiOperation({
    summary: 'Find nearby hospitals and medical facilities',
    description:
      'Uses Google Places API to find hospitals within specified radius of given coordinates',
  })
  @ApiResponse({
    status: 200,
    description: 'Nearby hospitals found successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          address: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' },
            },
          },
          distance: { type: 'number', description: 'Distance in meters' },
          rating: { type: 'number' },
          totalRatings: { type: 'number' },
          isOpen: { type: 'boolean' },
          phoneNumber: { type: 'string' },
          website: { type: 'string' },
          types: { type: 'array', items: { type: 'string' } },
          specialties: { type: 'array', items: { type: 'string' } },
          emergencyServices: { type: 'boolean' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid coordinates or parameters',
  })
  @ApiResponse({ status: 503, description: 'Google Maps API not configured' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findNearbyHospitals(@Query() searchDto: NearbySearchDto) {
    try {
      const response =
        await this.locationService.findNearbyHospitals(searchDto);
      return new SuccessResponseObject('Location found successfully', response);
    } catch (error) {
      ErrorResponseObject('Failed to find location', error);
    }
  }

  @Get('nearby-emergency')
  @ApiOperation({
    summary: 'Find nearest emergency services',
    description:
      'Finds hospitals and medical facilities that provide emergency services near given coordinates',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency services found successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid coordinates or parameters',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findNearbyEmergencyServices(@Query() searchDto: NearbySearchDto) {
    try {
      const response =
        await this.locationService.findNearbyEmergencyServices(searchDto);
      return new SuccessResponseObject(
        'Emergency services found successfully',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to find nearby emergency services', error);
    }
  }

  @Get('search-hospitals')
  @ApiOperation({
    summary: 'Search for hospitals by name or type',
    description:
      'Search for specific hospitals or medical facilities by name or medical specialty',
  })
  @ApiResponse({
    status: 200,
    description: 'Hospital search completed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchHospitals(@Query() searchDto: HospitalSearchDto) {
    try {
      const response = await this.locationService.searchHospitals(searchDto);
      return new SuccessResponseObject('Hospital found successfully', response);
    } catch (error) {
      ErrorResponseObject('Failed to find hospital', error);
    }
  }

  @Get('place-details/:placeId')
  @ApiOperation({
    summary: 'Get detailed information about a specific place',
    description:
      'Retrieves detailed information including contact details, hours, and reviews for a specific hospital',
  })
  @ApiResponse({
    status: 200,
    description: 'Place details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async getPlaceDetails(@Query('placeId') placeId: string) {
    try {
      const response = await this.locationService.getPlaceDetails(placeId);
      return new SuccessResponseObject('Details found successfully', response);
    } catch (error) {
      ErrorResponseObject('Failed to find details for the place', error);
    }
  }

  @Get('emergency-info')
  @ApiOperation({
    summary: 'Get emergency contact information and tips',
    description:
      'Returns emergency numbers and important information for maternal health emergencies',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency information retrieved successfully',
  })
  getEmergencyInfo() {
    const response = {
      emergencyNumbers: {
        national: {
          emergency: '199',
          police: '199',
          fire: '199',
        },
        medical: {
          ncdc: '0800-9700-0010',
          ncdc_sms: '08099555577',
          lagos_ambulance: '199',
        },
      },
      maternalEmergencyWarningSigns: [
        'Severe bleeding during pregnancy or after delivery',
        'Severe headaches with blurred vision',
        'High fever (over 38°C/100.4°F)',
        'Severe abdominal pain',
        'Difficulty breathing or chest pain',
        'Sudden swelling of hands, face, or feet',
        'Decreased or no fetal movement',
        'Water breaks before 37 weeks',
        'Severe nausea and vomiting',
        'Signs of infection (foul-smelling discharge, burning urination)',
      ],
      emergencyActions: [
        'Call emergency services immediately (199)',
        'If no ambulance available, arrange immediate transport to nearest hospital',
        'Stay calm and keep the patient comfortable',
        'If bleeding, do not remove any objects, apply gentle pressure with clean cloth',
        'Monitor breathing and pulse if possible',
        'Prepare to provide medical history and current medications to medical team',
      ],
      preparednessChecklist: [
        'Know the location of nearest emergency hospital',
        'Have emergency contact numbers saved in phone',
        'Keep important medical documents accessible',
        'Have a hospital bag prepared after 32 weeks',
        'Identify multiple routes to hospital',
        'Arrange backup transportation options',
      ],
    };
    return new SuccessResponseObject('Contacts fetched successfully', response);
  }
}
