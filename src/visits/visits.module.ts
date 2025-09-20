import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { Visit } from './entities/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visit])],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService]
})
export class VisitsModule {}
