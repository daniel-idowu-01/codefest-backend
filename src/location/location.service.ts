import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { NearbySearchDto, HospitalSearchDto } from './dto/nearby-search.dto';
import { GooglePlacesResponse, GooglePlaceResult, PlaceDetails } from './interfaces/google-places.interface';

export interface NearbyHospital {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  rating?: number;
  totalRatings?: number;
  isOpen?: boolean;
  phoneNumber?: string;
  website?: string;
  types: string[];
  specialties: string[];
  emergencyServices: boolean;
  openingHours?: string[];
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly googleApiKey: string;
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.googleApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') as string;
    if (!this.googleApiKey) {
      this.logger.warn('GOOGLE_MAPS_API_KEY not found. Location services will not work.');
    }
  }

  async findNearbyHospitals(searchDto: NearbySearchDto): Promise<NearbyHospital[]> {
    if (!this.googleApiKey) {
      throw new HttpException(
        'Google Maps API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const { lat, lng, radius } = searchDto;
      
      const hospitalTypes = ['hospital', 'doctor', 'health'];
      const allResults: GooglePlaceResult[] = [];

      for (const type of hospitalTypes) {
        const url = `${this.baseUrl}/nearbysearch/json`;
        const params = {
          location: `${lat},${lng}`,
          radius: radius && radius.toString(),
          type,
          key: this.googleApiKey,
        };

        const response = await firstValueFrom(
          this.httpService.get<GooglePlacesResponse>(url, { params }),
        );

        if (response.data.status === 'OK') {
          allResults.push(...response.data.results);
        } else if (response.data.status !== 'ZERO_RESULTS') {
          this.logger.warn(`Google Places API error: ${response.data.status} - ${response.data.error_message}`);
        }
      }

      const uniqueResults = allResults.filter(
        (result, index, self) => 
          index === self.findIndex(r => r.place_id === result.place_id)
      );

      const hospitals = await Promise.all(
        uniqueResults.map(result => this.transformToNearbyHospital(result, lat, lng))
      );

      return hospitals
        .sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, 20);

    } catch (error) {
      this.logger.error('Error finding nearby hospitals:', error);
      throw new HttpException(
        'Failed to find nearby hospitals',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findNearbyEmergencyServices(searchDto: NearbySearchDto): Promise<NearbyHospital[]> {
    if (!this.googleApiKey) {
      throw new HttpException(
        'Google Maps API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const { lat, lng, radius } = searchDto;
      
      const url = `${this.baseUrl}/nearbysearch/json`;
      const params = {
        location: `${lat},${lng}`,
        radius: radius && Math.min(radius, 10000).toString(), // Max 10km for emergency services
        keyword: 'emergency hospital trauma center ambulance',
        type: 'hospital',
        key: this.googleApiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get<GooglePlacesResponse>(url, { params }),
      );

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new HttpException(
          `Google Places API error: ${response.data.error_message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const hospitals = await Promise.all(
        response.data.results.map(result => 
          this.transformToNearbyHospital(result, lat, lng, true)
        )
      );

      // Prioritize 24-hour facilities and those with emergency in the name
      return hospitals
        .sort((a, b) => {
          const aEmergency = a.name.toLowerCase().includes('emergency') || 
                           a.name.toLowerCase().includes('trauma');
          const bEmergency = b.name.toLowerCase().includes('emergency') || 
                           b.name.toLowerCase().includes('trauma');
          
          if (aEmergency && !bEmergency) return -1;
          if (!aEmergency && bEmergency) return 1;
          
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, 10);

    } catch (error) {
      this.logger.error('Error finding emergency services:', error);
      throw new HttpException(
        'Failed to find emergency services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchHospitals(searchDto: HospitalSearchDto): Promise<NearbyHospital[]> {
    if (!this.googleApiKey) {
      throw new HttpException(
        'Google Maps API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const { query, lat, lng, radius } = searchDto;
      
      const url = `${this.baseUrl}/textsearch/json`;
      const params: any = {
        query: `${query} hospital medical center clinic`,
        key: this.googleApiKey,
      };

      if (lat && lng) {
        params.location = `${lat},${lng}`;
        params.radius = radius && radius.toString();
      }

      const response = await firstValueFrom(
        this.httpService.get<GooglePlacesResponse>(url, { params }),
      );

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new HttpException(
          `Google Places API error: ${response.data.error_message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const hospitals = await Promise.all(
        response.data.results.map(result => 
          this.transformToNearbyHospital(result, lat, lng)
        )
      );

      return hospitals.slice(0, 15);

    } catch (error) {
      this.logger.error('Error searching hospitals:', error);
      throw new HttpException(
        'Failed to search hospitals',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.googleApiKey) {
      return null;
    }

    try {
      const url = `${this.baseUrl}/details/json`;
      const params = {
        place_id: placeId,
        fields: 'place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,opening_hours,geometry,rating,user_ratings_total,types,reviews',
        key: this.googleApiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      if (response.data.status === 'OK') {
        return response.data.result;
      }

      return null;
    } catch (error) {
      this.logger.error('Error getting place details:', error);
      return null;
    }
  }

  private async transformToNearbyHospital(
    place: GooglePlaceResult,
    userLat?: number,
    userLng?: number,
    isEmergency = false,
  ): Promise<NearbyHospital> {
    let distance: number | undefined;
    if (userLat && userLng) {
      distance = this.calculateDistance(
        userLat,
        userLng,
        place.geometry.location.lat,
        place.geometry.location.lng,
      );
    }

    const specialties = this.extractSpecialties(place.name, place.types);
    
    let phoneNumber: string | undefined;
    let website: string | undefined;
    let openingHours: string[] | undefined;

    try {
      const details = await this.getPlaceDetails(place.place_id);
      if (details) {
        phoneNumber = details.formatted_phone_number || details.international_phone_number;
        website = details.website;
        openingHours = details.opening_hours?.weekday_text;
      }
    } catch (error) {
      this.logger.warn(`Failed to get details for place ${place.place_id}`);
    }

    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity || 'Address not available',
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      distance,
      rating: place.rating,
      // totalRatings: place.user_ratings_total,
      isOpen: place.opening_hours?.open_now,
      phoneNumber,
      website,
      types: place.types,
      specialties,
      emergencyServices: isEmergency || this.hasEmergencyServices(place.name, place.types),
      openingHours,
    };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private extractSpecialties(name: string, types: string[]): string[] {
    const specialties: string[] = [];
    const nameLower = name.toLowerCase();

    if (nameLower.includes('maternity') || nameLower.includes('maternal')) {
      specialties.push('Maternal Health');
    }
    if (nameLower.includes('women') || nameLower.includes("women's")) {
      specialties.push("Women's Health");
    }
    if (nameLower.includes('obstetric') || nameLower.includes('gynecolog')) {
      specialties.push('Obstetrics & Gynecology');
    }
    if (nameLower.includes('pediatric') || nameLower.includes('children')) {
      specialties.push('Pediatrics');
    }
    if (nameLower.includes('emergency') || nameLower.includes('trauma')) {
      specialties.push('Emergency Medicine');
    }
    if (nameLower.includes('teaching') || nameLower.includes('university')) {
      specialties.push('Teaching Hospital');
    }
    if (nameLower.includes('specialist') || nameLower.includes('specialty')) {
      specialties.push('Specialist Care');
    }

    if (types.includes('hospital')) {
      specialties.push('General Hospital');
    }
    if (types.includes('doctor')) {
      specialties.push('Medical Practice');
    }

    return specialties.length > 0 ? specialties : ['General Medical Care'];
  }

  private hasEmergencyServices(name: string, types: string[]): boolean {
    const nameLower = name.toLowerCase();
    return (
      nameLower.includes('emergency') ||
      nameLower.includes('trauma') ||
      nameLower.includes('urgent') ||
      nameLower.includes('teaching') ||
      types.includes('hospital')
    );
  }
}