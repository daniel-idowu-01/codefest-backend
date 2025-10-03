import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type EmergencyContactDocument = EmergencyContact & Document;

@Schema({
  collection: 'emergency_contacts',
  timestamps: { createdAt: true, updatedAt: false },
})
export class EmergencyContact {
  @ApiProperty({ description: 'Unique identifier for the contact' })
  @Prop({ type: String, default: () => crypto.randomUUID(), unique: true })
  id: string;

  @ApiProperty({ description: 'Name of the facility or contact' })
  @Prop({ type: String, required: true, maxlength: 255 })
  name: string;

  @ApiProperty({ description: 'Type of contact (hospital, clinic, hotline)' })
  @Prop({ type: String, required: true, maxlength: 100 })
  type: string;

  @ApiProperty({ description: 'Phone number' })
  @Prop({ type: String, required: true, maxlength: 20 })
  phoneNumber: string;

  @ApiProperty({ description: 'Alternative phone number', required: false })
  @Prop({ type: String, maxlength: 20 })
  alternativePhone?: string;

  @ApiProperty({ description: 'Physical address', required: false })
  @Prop({ type: String })
  address?: string;

  @ApiProperty({ description: 'State/Location' })
  @Prop({ type: String, required: true, maxlength: 100 })
  state: string;

  @ApiProperty({ description: 'Local Government Area', required: false })
  @Prop({ type: String, maxlength: 100 })
  lga?: string;

  @ApiProperty({ description: 'Whether available 24/7' })
  @Prop({ type: Boolean, default: false })
  is24Hours: boolean;

  @ApiProperty({
    description: 'Specialization or services offered',
    required: false,
  })
  @Prop({ type: String })
  specialization?: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const EmergencyContactSchema =
  SchemaFactory.createForClass(EmergencyContact);
