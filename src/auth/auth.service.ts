import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, SignUpDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { OtpService } from 'src/otp/otp.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly otpService: OtpService,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.userService.getUserByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.createUser(signUpDto);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    await this.otpService.sendOtp(user);

    return user;
  }

  async onboarding(userId: string, createAuthDto: CreateAuthDto) {
    const existingUser = await this.userService.getUserById(userId);
    if (existingUser) {
      throw new ConflictException('User already onboarded');
    }

    const user = await this.userService.onboarding(userId, createAuthDto);
    if (!user) {
      throw new InternalServerErrorException('Onboarding failed');
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    // if (user && (await bcrypt.compare(password, user.password))) {
    //   return user;
    // }
    return null;
  }

  async login(loginAuthDto: LoginAuthDto, res: Response) {
    const user = await this.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    return { access_token };
  }
}
