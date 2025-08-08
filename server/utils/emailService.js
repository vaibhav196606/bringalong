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

  async sendWelcomeEmail(email, userName, linkedinUrl) {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'BringAlong Team',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: email,
        subject: '🌍 Welcome to BringAlong - Your Journey Starts Here!',
        html: this.getWelcomeTemplate(userName, linkedinUrl),
        text: this.getWelcomeTextTemplate(userName, linkedinUrl)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Welcome Email Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      console.log('✅ Welcome email sent successfully to:', email);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTripPostConfirmationEmail(email, userName, tripDetails) {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'BringAlong Team',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: email,
        subject: `✈️ Trip Posted Successfully: ${tripDetails.fromCity} → ${tripDetails.toCity}`,
        html: this.getTripPostTemplate(userName, tripDetails),
        text: this.getTripPostTextTemplate(userName, tripDetails)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Trip Post Email Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      console.log('✅ Trip post confirmation email sent successfully to:', email);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send trip post confirmation email:', error);
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

  getWelcomeTemplate(userName, linkedinUrl) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to BringAlong</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background: #f8fafc;
            }
            .container { 
                background: #ffffff; 
                border-radius: 12px; 
                padding: 40px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
            }
            .logo { 
                background: linear-gradient(135deg, #2563eb, #3b82f6); 
                color: white; 
                width: 70px; 
                height: 70px; 
                border-radius: 16px; 
                display: inline-flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 28px; 
                font-weight: bold; 
                margin-bottom: 20px; 
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            }
            .welcome-title {
                font-size: 28px;
                font-weight: 700;
                color: #1e293b;
                margin: 20px 0;
            }
            .button { 
                display: inline-block; 
                background: linear-gradient(135deg, #2563eb, #3b82f6); 
                color: white; 
                padding: 16px 32px; 
                text-decoration: none; 
                border-radius: 10px; 
                font-weight: 600; 
                margin: 20px 10px; 
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                transition: transform 0.2s;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .feature-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 30px 0;
            }
            .feature-card {
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
            }
            .feature-icon {
                font-size: 24px;
                margin-bottom: 10px;
            }
            .safety-section {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 20px;
                margin: 30px 0;
                border-radius: 8px;
            }
            .footer { 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 30px; 
                border-top: 1px solid #e2e8f0; 
                color: #64748b; 
                font-size: 14px; 
            }
            .steps {
                background: #f0f9ff;
                border: 1px solid #0ea5e9;
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
            }
            .step {
                display: flex;
                align-items: flex-start;
                margin: 15px 0;
            }
            .step-number {
                background: #2563eb;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                margin-right: 15px;
                flex-shrink: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">B</div>
                <h1 class="welcome-title">Welcome to BringAlong!</h1>
                <p style="font-size: 18px; color: #64748b;">The global community connecting travelers worldwide</p>
            </div>
            
            <p>Hi ${userName},</p>
            
            <p>🎉 <strong>Welcome to the BringAlong community!</strong> We're thrilled to have you join our global network of verified travelers helping each other across the world.</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">✈️</div>
                    <h3>Post Trips</h3>
                    <p>Share your travel plans and earn service fees</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📦</div>
                    <h3>Request Items</h3>
                    <p>Get items from anywhere in the world</p>
                </div>
            </div>

            <div class="steps">
                <h3 style="color: #0ea5e9; margin-bottom: 20px;">🚀 Getting Started Guide</h3>
                
                <div class="step">
                    <div class="step-number">1</div>
                    <div>
                        <strong>Post Your First Trip</strong><br>
                        Share your upcoming travel plans with dates, destinations, and service fees. Include items you can bring to help others.
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <div>
                        <strong>Browse & Request Items</strong><br>
                        Search for travelers going to your desired destinations and request specific items with clear descriptions.
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <div>
                        <strong>Connect via LinkedIn</strong><br>
                        Use LinkedIn to verify profiles and communicate securely with other community members.
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">4</div>
                    <div>
                        <strong>Complete Transactions</strong><br>
                        Coordinate safely, complete deliveries, and build your reputation in the community.
                    </div>
                </div>
            </div>

            <div class="safety-section">
                <h3 style="color: #92400e; margin-bottom: 15px;">🛡️ Safety & Trust Guidelines</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                    <li><strong>Verify LinkedIn Profiles:</strong> Always check professional backgrounds and endorsements</li>
                    <li><strong>Meet in Public Places:</strong> Choose safe, public locations for item exchanges</li>
                    <li><strong>Trust Your Instincts:</strong> If something feels off, don't proceed with the transaction</li>
                    <li><strong>Keep Communication Clear:</strong> Document all agreements and expectations</li>
                    <li><strong>Use Secure Payments:</strong> Consider payment methods that offer protection for both parties</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <h3>Ready to start your journey?</h3>
                <a href="${process.env.FRONTEND_URL || 'https://bringalong.vercel.app'}/post-trip" class="button">Post Your First Trip</a>
                <a href="${process.env.FRONTEND_URL || 'https://bringalong.vercel.app'}/all-trips" class="button">Browse Trips</a>
            </div>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
                <h4 style="color: #0ea5e9; margin-bottom: 10px;">💰 No Platform Fees</h4>
                <p style="margin: 0; color: #0369a1;">BringAlong is a non-profit community platform. Travelers keep 100% of their service fees!</p>
            </div>
            
            <div class="footer">
                <p><strong>Your LinkedIn Profile:</strong> <a href="${linkedinUrl}" style="color: #2563eb;">${linkedinUrl}</a></p>
                <p>Need help? Contact our support team or visit our help center.</p>
                <p>© ${new Date().getFullYear()} BringAlong. A non-profit community platform.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  getWelcomeTextTemplate(userName, linkedinUrl) {
    return `
Hi ${userName},

🎉 Welcome to the BringAlong community!

We're thrilled to have you join our global network of verified travelers helping each other across the world.

GETTING STARTED:

1. Post Your First Trip
   Share your upcoming travel plans with dates, destinations, and service fees.

2. Browse & Request Items  
   Search for travelers going to your desired destinations and request specific items.

3. Connect via LinkedIn
   Use LinkedIn to verify profiles and communicate securely with other members.

4. Complete Transactions
   Coordinate safely, complete deliveries, and build your reputation.

SAFETY GUIDELINES:
- Always verify LinkedIn profiles thoroughly
- Meet in public places for exchanges
- Trust your instincts about transactions
- Keep communication clear and documented
- Use secure payment methods

💰 NO PLATFORM FEES
BringAlong is a non-profit community platform. Travelers keep 100% of their service fees!

Your LinkedIn Profile: ${linkedinUrl}

Ready to start? Visit: ${process.env.FRONTEND_URL || 'https://bringalong.vercel.app'}

Need help? Contact our support team.

© ${new Date().getFullYear()} BringAlong. A non-profit community platform.
    `;
  }

  getTripPostTemplate(userName, tripDetails) {
    const { fromCity, fromCountry, toCity, toCountry, travelDate, serviceFee, currency, itemsCanBring } = tripDetails;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trip Posted Successfully</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background: #f8fafc;
            }
            .container { 
                background: #ffffff; 
                border-radius: 12px; 
                padding: 40px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
            }
            .logo { 
                background: linear-gradient(135deg, #059669, #10b981); 
                color: white; 
                width: 70px; 
                height: 70px; 
                border-radius: 16px; 
                display: inline-flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 28px; 
                font-weight: bold; 
                margin-bottom: 20px; 
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            }
            .success-title {
                font-size: 26px;
                font-weight: 700;
                color: #059669;
                margin: 20px 0;
            }
            .trip-card {
                background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                border: 2px solid #0ea5e9;
                border-radius: 12px;
                padding: 30px;
                margin: 25px 0;
                text-align: center;
            }
            .route {
                font-size: 24px;
                font-weight: 700;
                color: #0369a1;
                margin-bottom: 15px;
            }
            .trip-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
                text-align: left;
            }
            .detail-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #0ea5e9;
            }
            .detail-label {
                font-weight: 600;
                color: #0369a1;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .detail-value {
                font-size: 16px;
                color: #1e293b;
                margin-top: 5px;
            }
            .items-section {
                background: #f0fdf4;
                border: 1px solid #22c55e;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
            }
            .item-tag {
                display: inline-block;
                background: #22c55e;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                margin: 3px;
                font-weight: 500;
            }
            .button { 
                display: inline-block; 
                background: linear-gradient(135deg, #2563eb, #3b82f6); 
                color: white; 
                padding: 16px 32px; 
                text-decoration: none; 
                border-radius: 10px; 
                font-weight: 600; 
                margin: 20px 10px; 
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            }
            .tips-section {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 20px;
                margin: 30px 0;
                border-radius: 8px;
            }
            .footer { 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 30px; 
                border-top: 1px solid #e2e8f0; 
                color: #64748b; 
                font-size: 14px; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✈️</div>
                <h1 class="success-title">Trip Posted Successfully!</h1>
                <p style="font-size: 18px; color: #64748b;">Your trip is now live and visible to the community</p>
            </div>
            
            <p>Hi ${userName},</p>
            
            <p>🎉 Great news! Your trip has been successfully posted on BringAlong and is now visible to our global community of travelers.</p>
            
            <div class="trip-card">
                <div class="route">${fromCity}, ${fromCountry} → ${toCity}, ${toCountry}</div>
                
                <div class="trip-details">
                    <div class="detail-item">
                        <div class="detail-label">Travel Date</div>
                        <div class="detail-value">${new Date(travelDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Service Fee</div>
                        <div class="detail-value">${serviceFee} ${currency}</div>
                    </div>
                </div>
            </div>

            ${itemsCanBring && itemsCanBring.length > 0 ? `
            <div class="items-section">
                <h3 style="color: #166534; margin-bottom: 15px;">📦 Items You Can Bring</h3>
                <div>
                    ${itemsCanBring.map(item => `<span class="item-tag">${item}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            <div class="tips-section">
                <h3 style="color: #92400e; margin-bottom: 15px;">💡 Tips for Success</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                    <li><strong>Respond Quickly:</strong> Reply to requests promptly to build trust</li>
                    <li><strong>Be Detailed:</strong> Provide clear information about item restrictions</li>
                    <li><strong>Stay Professional:</strong> Maintain professional communication via LinkedIn</li>
                    <li><strong>Set Expectations:</strong> Clearly communicate delivery timelines and fees</li>
                    <li><strong>Keep Records:</strong> Document all agreements and transactions</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <h3>Manage Your Trip</h3>
                <a href="${process.env.FRONTEND_URL || 'https://bringalong.vercel.app'}/trips" class="button">View My Trips</a>
                <a href="${process.env.FRONTEND_URL || 'https://bringalong.vercel.app'}/trip/${tripDetails._id || ''}" class="button">View Trip Details</a>
            </div>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
                <h4 style="color: #0ea5e9; margin-bottom: 15px;">🔔 What's Next?</h4>
                <div style="text-align: left; color: #0369a1;">
                    <p style="margin: 10px 0;"><strong> LinkedIn Connections:</strong> Interested users will connect with you via LinkedIn to discuss details and verify authenticity.</p>
                    <p style="margin: 10px 0;"><strong>📱 Stay Active:</strong> Check your LinkedIn messages regularly for new connection requests and opportunities!</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for being part of the BringAlong community!</p>
                <p>Need help? Contact our support team or visit our help center.</p>
                <p>© ${new Date().getFullYear()} BringAlong. A non-profit community platform.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  getTripPostTextTemplate(userName, tripDetails) {
    const { fromCity, fromCountry, toCity, toCountry, travelDate, serviceFee, currency, itemsCanBring } = tripDetails;
    
    return `
Hi ${userName},

🎉 Trip Posted Successfully!

Your trip has been successfully posted on BringAlong and is now visible to our global community.

TRIP DETAILS:
Route: ${fromCity}, ${fromCountry} → ${toCity}, ${toCountry}
Travel Date: ${new Date(travelDate).toLocaleDateString()}
Service Fee: ${serviceFee} ${currency}

${itemsCanBring && itemsCanBring.length > 0 ? `
Items You Can Bring: ${itemsCanBring.join(', ')}
` : ''}

TIPS FOR SUCCESS:
- Respond quickly to requests to build trust
- Be detailed about item restrictions
- Stay professional in all communications
- Set clear expectations about delivery
- Keep records of all agreements

WHAT'S NEXT:
 LinkedIn Connections: Interested users will connect with you via LinkedIn to discuss details and verify authenticity.
📱 Stay Active: Check your LinkedIn messages regularly for new connection requests and opportunities!

Manage your trip: ${process.env.FRONTEND_URL || 'https://bringalong.vercel.app'}/trips

Thank you for being part of the BringAlong community!

© ${new Date().getFullYear()} BringAlong. A non-profit community platform.
    `;
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;
