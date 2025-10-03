import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  country: string;

  @IsString()
  language: string;

  @IsString()
  age: string;

  @IsString()
  address: string;

  @IsString()
  lastMensturalPeriod: string;

  @IsString()
  specialCondition: string;
}

export class SignUpDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;
}
