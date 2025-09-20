import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  signUp(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  login(loginAuthDto: LoginAuthDto) {
    return `This action returns all auth`;
  }
}
