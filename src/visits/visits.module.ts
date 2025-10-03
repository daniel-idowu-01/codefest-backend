import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
// import { Visit } from './entities/visit.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from './schema/visit.schema';

@Module({
  // imports: [TypeOrmModule.forFeature([Visit])],
  imports: [
    MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}
