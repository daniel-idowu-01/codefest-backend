import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 3,
    }),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
