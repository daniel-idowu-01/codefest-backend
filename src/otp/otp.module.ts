import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Otp } from './entities/otp.entity';
import { EmailService } from 'src/lib/email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schema/otp.schema';

@Module({
  // imports: [TypeOrmModule.forFeature([Otp])],
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [OtpController],
  providers: [OtpService, EmailService],
  exports: [OtpService],
})
export class OtpModule {}
