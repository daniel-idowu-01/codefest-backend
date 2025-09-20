import { Document } from "mongoose";
import { IAuditFields } from "src/shared/mongo/base";
import { Schema,Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop() name: string;
  @Prop() email: string;
  @Prop() deletedAt?: Date;
}
export type UserDocument = Document<unknown, {}, User> & User & IAuditFields;
export const UserSchema = SchemaFactory.createForClass(User);
