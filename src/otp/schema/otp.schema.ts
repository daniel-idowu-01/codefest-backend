import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type OtpDocument = Otp & Document;

export enum OtpType {
  VERIFICATION_CODE = 'verification_code',
}

@Schema({ collection: 'otp', timestamps: true })
export class Otp {
  @ApiProperty({ description: 'User associated with this OTP' })
  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  user?: User | Types.ObjectId;

  @ApiProperty({ description: 'OTP code' })
  @Prop({ type: String, required: true, maxlength: 255 })
  otp: string;

  @ApiProperty({ description: 'Date the OTP was used' })
  @Prop({ type: Date })
  usedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
