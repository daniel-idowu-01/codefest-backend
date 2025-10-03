import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Otp } from 'src/otp/entities/otp.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the user' })
  @Column({ length: 255, nullable: true })
  name: string;

  @ApiProperty({ description: 'Email of user' })
  @Column({ length: 255, unique: true })
  email: string;

  // @ApiProperty({ description: 'Date the email was verified' })
  // @Column({ type: 'datetime', nullable: true })
  // emailVerifiedAt?: Date;

  // @Exclude()
  // @ApiProperty({ description: 'Password of user' })
  // @Column({ length: 255, nullable: true })
  // password: string;

  @ApiProperty({ description: 'Phone number' })
  @Column({ length: 20, unique: true, nullable: true })
  phoneNumber: string;

  @ApiProperty({ description: 'Physical address', required: false })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   if (this.password && !this.password.startsWith('$2b$')) {
  //     const salt = await bcrypt.genSalt(10);
  //     this.password = await bcrypt.hash(this.password, salt);
  //   }
  // }

  @OneToOne(() => Otp, (otp) => otp.user, { cascade: true, eager: false })
  otp?: Otp;
}
