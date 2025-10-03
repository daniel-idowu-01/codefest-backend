import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { EmailService } from 'src/lib/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService, EmailService],
  exports: [OtpService]
})
export class OtpModule {}
