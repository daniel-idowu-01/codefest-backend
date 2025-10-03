import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret: Record<string, any>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
  },
})
export class User {
  @ApiProperty({ description: 'Name of the user' })
  @Prop({ type: String, maxlength: 255 })
  name?: string;

  @ApiProperty({ description: 'Email of user' })
  @Prop({ type: String, required: true, unique: true, maxlength: 255 })
  email: string;

  // @ApiProperty({ description: 'Password of user' })
  // @Prop({ type: String, maxlength: 255 })
  // password?: string;

  @ApiProperty({ description: 'Phone number' })
  @Prop({ type: String, unique: true, maxlength: 20 })
  phoneNumber?: string;

  @ApiProperty({ description: 'Physical address', required: false })
  @Prop({ type: String })
  address?: string;

  @ApiProperty({ description: 'Date of onboarding' })
  @Prop({ type: Date })
  onboardedAt?: Date;

  @ApiProperty({ description: 'Date of email verification' })
  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Record update timestamp' })
  @Prop({ type: Date })
  updatedAt: Date;

  // async hashPassword() {
  //   if (this.password && !this.password.startsWith('$2b$')) {
  //     const salt = await bcrypt.genSalt(10);
  //     this.password = await bcrypt.hash(this.password, salt);
  //   }
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// UserSchema.set('toJSON', { virtuals: true });
// UserSchema.set('toObject', { virtuals: true });

// UserSchema.pre('save', async function (next) {
//   const user = this as UserDocument;
//   if (user.password && !user.password.startsWith('$2b$')) {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//   }
//   next();
// });
