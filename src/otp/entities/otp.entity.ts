import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Entity('otp')
export class Otp {
  @ApiProperty({ description: 'Unique identifier for the OTP' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User associated with this OTP' })
  @OneToOne(() => User, (user) => user.otp, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true, update: false })
  userId?: string;

  @ApiProperty({ description: 'OTP code' })
  @Column({ length: 255 })
  otp: string;

  @ApiProperty({ description: 'Date the OTP was used' })
  @Column({ type: 'datetime', nullable: true })
  usedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
