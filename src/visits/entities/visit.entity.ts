import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('visits')
export class Visit {
  @ApiProperty({ description: 'Unique identifier for the visit' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the antenatal visit' })
  @Column({ type: 'datetime' })
  visitDate: Date;

  @ApiProperty({ description: 'Name of the doctor or healthcare provider' })
  @Column({ length: 255 })
  doctorName: string;

  @ApiProperty({ description: 'Notes about the visit', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'Current week of pregnancy', required: false })
  @Column({ nullable: true })
  pregnancyWeek: number;

  @ApiProperty({ description: 'Weight measurement in kg', required: false })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @ApiProperty({ description: 'Blood pressure reading', required: false })
  @Column({ length: 20, nullable: true })
  bloodPressure: string;

  @ApiProperty({ description: 'Next visit reminder date', required: false })
  @Column({ type: 'datetime', nullable: true })
  nextVisitReminder: Date | null;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
