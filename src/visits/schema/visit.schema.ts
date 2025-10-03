import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema({
  collection: 'visits',
  timestamps: { createdAt: true, updatedAt: true },
})
export class Visit {
  @ApiProperty({ description: 'Unique identifier for the visit' })
  @Prop({ type: String, default: () => crypto.randomUUID(), unique: true })
  id: string;

  @ApiProperty({ description: 'Date of the antenatal visit' })
  @Prop({ type: Date, required: true })
  visitDate: Date;

  @ApiProperty({ description: 'Name of the doctor or healthcare provider' })
  @Prop({ type: String, required: true, maxlength: 255 })
  doctorName: string;

  @ApiProperty({ description: 'Notes about the visit', required: false })
  @Prop({ type: String })
  notes?: string;

  @ApiProperty({ description: 'Current week of pregnancy', required: false })
  @Prop({ type: Number })
  pregnancyWeek?: number;

  @ApiProperty({ description: 'Weight measurement in kg', required: false })
  @Prop({ type: Number })
  weight?: number;

  @ApiProperty({ description: 'Blood pressure reading', required: false })
  @Prop({ type: String, maxlength: 20 })
  bloodPressure?: string;

  @ApiProperty({ description: 'Next visit reminder date', required: false })
  @Prop({ type: Date })
  nextVisitReminder?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
