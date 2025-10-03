import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Otp, OtpDocument, OtpType } from './schema/otp.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';
import crypto from 'crypto';
import { EmailService } from 'src/lib/email/email.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private readonly emailService: EmailService,
  ) {}

  async sendOtp(user: UserDocument): Promise<Otp> {
    await this.otpModel.deleteMany({ userId: user.id });

    const otpCode = this.generateCode();

    const otp = new this.otpModel({
      otp: otpCode,
      userId: user._id,
    });
    const updatedOtp = await otp.save();

    await this.emailService.sendOtp(
      user.email,
      otpCode,
      OtpType.VERIFICATION_CODE,
    );

    return updatedOtp;
  }

  async validate(userId: string, code: string): Promise<boolean> {
    const otp = await this.otpModel
      .findOne({ userId: new Types.ObjectId(userId), otp: code })
      .exec();

    if (!otp) throw new NotFoundException('OTP not found or invalid');
    if (otp.usedAt) throw new BadRequestException('OTP already used');

    const expired =
      new Date().getTime() - otp.createdAt.getTime() > 5 * 60 * 1000;
    if (expired) throw new BadRequestException('OTP expired');

    otp.usedAt = new Date();
    await otp.save();

    return true;
  }

  private generateCode(): string {
    return crypto.randomInt(1000, 9999).toString();
  }
}
