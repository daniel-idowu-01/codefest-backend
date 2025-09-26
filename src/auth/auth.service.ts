import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async signUp(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userService.getUserByEmail(
      createAuthDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.createUser(createAuthDto);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return user;
  }

  async login(loginAuthDto: LoginAuthDto) {
    return `This action returns all auth`;
  }
}
