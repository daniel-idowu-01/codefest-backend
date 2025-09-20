import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('emergency_contacts')
export class EmergencyContact {
  @ApiProperty({ description: 'Unique identifier for the contact' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the facility or contact' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Type of contact (hospital, clinic, hotline)' })
  @Column({ length: 100 })
  type: string;

  @ApiProperty({ description: 'Phone number' })
  @Column({ length: 20 })
  phoneNumber: string;

  @ApiProperty({ description: 'Alternative phone number', required: false })
  @Column({ length: 20, nullable: true })
  alternativePhone: string;

  @ApiProperty({ description: 'Physical address', required: false })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ description: 'State/Location' })
  @Column({ length: 100 })
  state: string;

  @ApiProperty({ description: 'Local Government Area', required: false })
  @Column({ length: 100, nullable: true })
  lga: string;

  @ApiProperty({ description: 'Whether available 24/7' })
  @Column({ default: false })
  is24Hours: boolean;

  @ApiProperty({
    description: 'Specialization or services offered',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  specialization: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
}
