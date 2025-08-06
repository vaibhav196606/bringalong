import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  async init() {
    try {
      console.log('🔧 Initializing email service...');
      console.log('📧 Environment check:');
      console.log('- NODE_ENV:', process.env.NODE_ENV);
      console.log('- EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
      console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing');

      // Configure transporter based on environment
      if (process.env.NODE_ENV === 'production') {
        // Production: Use Gmail with App Password
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
          console.log('🔧 Setting up Gmail SMTP for production...');
          this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD // Gmail App Password
            },
            secure: true
          });
        } else {
          throw new Error('EMAIL_USER and EMAIL_PASSWORD must be set in production');
        }
      } else {
        // Development: Use Ethereal Email for testing
        console.log('🔧 Setting up Ethereal Email for development...');
        let testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      // Verify transporter
      if (this.transporter) {
        console.log('🔍 Verifying email configuration...');
        await this.transporter.verify();
        console.log('✅ Email service initialized successfully');
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  async sendPasswordResetEmail(email, resetUrl, userName = 'User') {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'BringAlong',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: email,
        subject: 'Reset Your BringAlong Password',
        html: this.getPasswordResetTemplate(resetUrl, userName),
        text: this.getPasswordResetTextTemplate(resetUrl, userName)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      console.log('✅ Password reset email sent successfully to:', email);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  getPasswordResetTemplate(resetUrl, userName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - BringAlong</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .container { 
                background: #ffffff; 
                border-radius: 10px; 
                padding: 40px; 
                box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
            }
            .logo { 
                background: #2563eb; 
                color: white; 
                width: 60px; 
                height: 60px; 
                border-radius: 12px; 
                display: inline-flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 20px; 
            }
            .button { 
                display: inline-block; 
                background: #2563eb; 
                color: white; 
                padding: 14px 28px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: 600; 
                margin: 20px 0; 
            }
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 1px solid #eee; 
                color: #666; 
                font-size: 14px; 
            }
            .warning { 
                background: #fef3c7; 
                border: 1px solid #f59e0b; 
                border-radius: 6px; 
                padding: 15px; 
                margin: 20px 0; 
                color: #92400e; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">B</div>
                <h1>Reset Your Password</h1>
            </div>
            
            <p>Hi ${userName},</p>
            
            <p>We received a request to reset your password for your BringAlong account. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons. If it expires, you'll need to request a new password reset.
            </div>
            
            <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
                <p>© ${new Date().getFullYear()} BringAlong. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  getPasswordResetTextTemplate(resetUrl, userName) {
    return `
Hi ${userName},

We received a request to reset your password for your BringAlong account.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 10 minutes for security reasons.

If you didn't request a password reset, you can safely ignore this email.

If you have any questions, please contact our support team.

© ${new Date().getFullYear()} BringAlong. All rights reserved.
    `;
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;
