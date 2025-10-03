const BaseEmailTemplate = (
  title: string,
  message: string,
  otp: string,
  expiresInMinutes: number,
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
      .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; margin: 20px 0; }
      .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        ${message}
        <div class="otp-code">${otp}</div>
        <p>This code will expire in ${expiresInMinutes} minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Virtual Flux Africa. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

export const OTPEmailTemplate = (otp: string, expires = 15) =>
  BaseEmailTemplate(
    'Your Verification Code',
    '<p>Your One-Time Password (OTP) for authentication is:</p>',
    otp,
    expires,
  );
export const OTPWithdrawalVerificationTemplate = (otp: string, expires = 15) =>
  BaseEmailTemplate(
    'Your Verification Code',
    '<p>Your One-Time Password (OTP) for withdrawal is:</p>',
    otp,
    expires,
  );

export const PasswordResetOTPTemplate = (otp: string, expires = 15) =>
  BaseEmailTemplate(
    'Your Password Reset Code',
    '<p>Your One-Time Password (OTP) for password reset is:</p>',
    otp,
    expires,
  );
