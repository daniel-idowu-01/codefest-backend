import { Injectable } from '@nestjs/common';
import { OTPEmailTemplate } from './email-template';
import nodemailer from 'nodemailer';
import { OtpType } from 'src/otp/schema/otp.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port,
      secure: false,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"MHT" <mht@info.com>`,
        to,
        subject,
        text,
        html,
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent:', info.messageId);

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendOtp(to: string, otp: string, type: string) {
    let subject: string;
    let html: string;

    switch (type) {
      case OtpType.VERIFICATION_CODE:
      default:
        subject = 'Verify Your Account';
        html = OTPEmailTemplate(otp);
        break;
    }

    return await this.sendMail(to, subject, `Your code is: ${otp}`, html);
  }
}
