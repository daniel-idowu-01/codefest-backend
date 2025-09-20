import { IsLatitude, IsLongitude, IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class NearbySearchDto {
  @ApiProperty({ 
    description: 'Latitude coordinate', 
    example: 6.5244,
    minimum: -90,
    maximum: 90 
  })
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @ApiProperty({ 
    description: 'Longitude coordinate', 
    example: 3.3792,
    minimum: -180,
    maximum: 180 
  })
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @ApiProperty({ 
    description: 'Search radius in meters (max 50km)', 
    example: 5000,
    required: false,
    minimum: 100,
    maximum: 50000 
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(50000)
  @Transform(({ value }) => parseInt(value) || 5000)
  radius?: number = 5000;
}

export class HospitalSearchDto {
  @ApiProperty({ 
    description: 'Search query for hospital name or type', 
    example: 'Lagos University Teaching Hospital' 
  })
  @IsString()
  query: string;

  @ApiProperty({ 
    description: 'Latitude for location-based search', 
    example: 6.5244,
    required: false 
  })
  @IsOptional()
  @IsLatitude()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  lat?: number;

  @ApiProperty({ 
    description: 'Longitude for location-based search', 
    example: 3.3792,
    required: false 
  })
  @IsOptional()
  @IsLongitude()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  lng?: number;

  @ApiProperty({ 
    description: 'Search radius in meters', 
    example: 10000,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(50000)
  @Transform(({ value }) => value ? parseInt(value) : 10000)
  radius?: number = 10000;
}