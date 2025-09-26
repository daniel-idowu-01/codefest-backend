import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SuccessResponseObject, ErrorResponseObject } from 'src/shared/https';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    try {
      const response = await this.authService.signUp(createAuthDto);

      return new SuccessResponseObject(
        'User created successfully!',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to create user', error);
    }
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      const response = await this.authService.login(loginAuthDto);

      return new SuccessResponseObject('User logged in!', response);
    } catch (error) {
      ErrorResponseObject('Failed to log user in', error);
    }
  }
}
