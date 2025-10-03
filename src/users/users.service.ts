import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { CreateAuthDto, SignUpDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUser: SignUpDto): Promise<UserDocument> {
    const user = new this.userModel(createUser);
    return await user.save();
  }

  async onboarding(userId: string, createUser: CreateAuthDto): Promise<User> {
    const existingUser = await this.userModel.findById(userId).exec();

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (existingUser.onboardedAt) {
      throw new ConflictException('User already onboarded');
    }

    Object.assign(existingUser, createUser, { onboardedAt: new Date() });

    return existingUser.save();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
