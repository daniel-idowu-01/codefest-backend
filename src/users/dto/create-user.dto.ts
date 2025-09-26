import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
