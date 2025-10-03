import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { User } from 'src/users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  async generate(user: User): Promise<Otp> {
    await this.otpRepo.delete({ userId: user.id });

    const otp = this.otpRepo.create({
      otp: this.generateCode(),
      userId: user.id,
    });

    return this.otpRepo.save(otp);
  }

  async validate(userId: string, code: string): Promise<boolean> {
    const otp = await this.otpRepo.findOne({
      where: { userId, otp: code },
    });

    if (!otp) throw new NotFoundException('OTP not found or invalid');
    if (otp.usedAt) throw new BadRequestException('OTP already used');

    const expired =
      new Date().getTime() - otp.createdAt.getTime() > 5 * 60 * 1000;
    if (expired) throw new BadRequestException('OTP expired');

    otp.usedAt = new Date();
    await this.otpRepo.save(otp);

    return true;
  }

  private generateCode(): string {
    return crypto.randomInt(1000, 9999).toString();
  }
}
