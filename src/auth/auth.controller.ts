import { Controller, Post, Body, Res, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, SignUpDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import type { Response } from 'express';
import { SuccessResponseObject, ErrorResponseObject } from 'src/shared/https';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const response = await this.authService.signUp(signUpDto);

      return new SuccessResponseObject('User created successfully!', response);
    } catch (error) {
      ErrorResponseObject('Failed to create user', error);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      const response = await this.authService.verifyEmail(verifyEmailDto);

      return new SuccessResponseObject(
        'Email verified successfully!',
        response,
      );
    } catch (error) {
      ErrorResponseObject('Failed to verify email', error);
    }
  }

  @Post('verify-phone-number')
  async verifyPhoneNumber(@Body() verifyPhoneDto: VerifyPhoneDto) {
    try {
      const response = await this.authService.verifyPhoneNumber(
        verifyPhoneDto.phoneNumber,
      );

      return new SuccessResponseObject('Phone number free to use!', response);
    } catch (error) {
      ErrorResponseObject('Failed to verify phone number', error);
    }
  }

  @Post('onboarding/:id')
  async onboarding(
    @Param('id') userId: string,
    @Body() createAuthDto: CreateAuthDto,
  ) {
    try {
      const response = await this.authService.onboarding(userId, createAuthDto);

      return new SuccessResponseObject('Onboarding successfully!', response);
    } catch (error) {
      ErrorResponseObject('Failed to create user', error);
    }
  }

  // @Post('login')
  // async login(
  //   @Body() loginAuthDto: LoginAuthDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   try {
  //     const response = await this.authService.login(loginAuthDto, res);

  //     return new SuccessResponseObject('User logged in!', response);
  //   } catch (error) {
  //     ErrorResponseObject('Failed to log user in', error);
  //   }
  // }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('access_token');
      return new SuccessResponseObject('Logged out successfully', null);
    } catch (error) {
      ErrorResponseObject('Failed to log user out', error);
    }
  }
}
