import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create transporter using GoDaddy SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GODADDY_EMAIL_USER,
        pass: process.env.GODADDY_EMAIL_PASS,
      },
    });

    // Email content for notification to sales team
    const mailOptions = {
      from: process.env.GODADDY_EMAIL_USER,
      to: 'sales@realtycanvas.in',
      subject: '🔔 New Newsletter Subscription - RealtyCanvas',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Newsletter Subscription</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📧 New Newsletter Subscription</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Someone just subscribed to your newsletter!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-top: 0;">📋 Subscription Details</h2>
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>Email Address:</strong> ${email}</p>
              <p style="margin: 10px 0 0 0;"><strong>Subscription Date:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 10px 0 0 0;"><strong>Source:</strong> RealtyCanvas Website Newsletter</p>
            </div>
          </div>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #0277bd; margin-top: 0;">📈 Next Steps</h3>
            <ul style="color: #01579b; padding-left: 20px;">
              <li>Add this email to your newsletter mailing list</li>
              <li>Send a welcome email with property updates</li>
              <li>Include them in your weekly property digest</li>
              <li>Consider sending exclusive deals and offers</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 8px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">This notification was sent from RealtyCanvas Newsletter System</p>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        </body>
        </html>
      `,
      text: `
        New Newsletter Subscription - RealtyCanvas
        
        Subscription Details:
        Email Address: ${email}
        Subscription Date: ${new Date().toLocaleString()}
        Source: RealtyCanvas Website Newsletter
        
        Next Steps:
        - Add this email to your newsletter mailing list
        - Send a welcome email with property updates
        - Include them in your weekly property digest
        - Consider sending exclusive deals and offers
        
        This notification was sent from RealtyCanvas Newsletter System
        Timestamp: ${new Date().toISOString()}
      `
    };

    // Send email notification to sales team
    await transporter.sendMail(mailOptions);

    // Send welcome email to the subscriber
    const welcomeMailOptions = {
      from: process.env.GODADDY_EMAIL_USER,
      to: email,
      subject: '🏠 Welcome to RealtyCanvas Newsletter - Your Property Journey Starts Here!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to RealtyCanvas Newsletter</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎉 Welcome to RealtyCanvas!</h1>
            <p style="color: white; margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Thank you for subscribing to our newsletter</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">🏠 What to Expect</h2>
            <div style="space-y: 15px;">
              <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <div style="background: #fef3c7; color: #92400e; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; flex-shrink: 0;">📧</div>
                <div>
                  <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 18px;">Weekly Property Updates</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Get the latest listings, market trends, and exclusive property deals delivered to your inbox every week.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <div style="background: #dbeafe; color: #1e40af; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; flex-shrink: 0;">💎</div>
                <div>
                  <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 18px;">Exclusive Deals & Offers</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Be the first to know about pre-launch projects, special discounts, and limited-time offers from top developers.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <div style="background: #d1fae5; color: #065f46; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; flex-shrink: 0;">📊</div>
                <div>
                  <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 18px;">Market Insights & Analysis</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Stay informed with expert analysis, price trends, and investment opportunities in the real estate market.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #0ea5e9;">
            <h3 style="color: #0c4a6e; margin-top: 0; font-size: 20px;">🚀 Get Started</h3>
            <p style="color: #075985; margin-bottom: 20px;">While you wait for your first newsletter, explore our current featured properties and discover your dream home or investment opportunity.</p>
            <div style="text-align: center;">
              <a href="https://realtycanvas.in/projects" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">Browse Properties</a>
            </div>
          </div>
          
          <div style="background: #fef7ed; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <h3 style="color: #9a3412; margin-top: 0; font-size: 18px;">📱 Stay Connected</h3>
            <p style="color: #c2410c; margin-bottom: 15px; font-size: 14px;">Follow us on social media for daily updates and behind-the-scenes content:</p>
            <div style="text-align: center;">
              <a href="#" style="display: inline-block; margin: 0 10px; color: #f59e0b; text-decoration: none; font-weight: bold;">Facebook</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #f59e0b; text-decoration: none; font-weight: bold;">Instagram</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #f59e0b; text-decoration: none; font-weight: bold;">LinkedIn</a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0;">You're receiving this email because you subscribed to RealtyCanvas newsletter.</p>
            <p style="margin: 0;">If you no longer wish to receive these emails, you can <a href="#" style="color: #f59e0b; text-decoration: none;">unsubscribe here</a>.</p>
            <p style="margin: 10px 0 0 0;">© 2024 RealtyCanvas. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to RealtyCanvas Newsletter!
        
        Thank you for subscribing to our newsletter. Here's what you can expect:
        
        📧 Weekly Property Updates
        Get the latest listings, market trends, and exclusive property deals delivered to your inbox every week.
        
        💎 Exclusive Deals & Offers
        Be the first to know about pre-launch projects, special discounts, and limited-time offers from top developers.
        
        📊 Market Insights & Analysis
        Stay informed with expert analysis, price trends, and investment opportunities in the real estate market.
        
        🚀 Get Started
        While you wait for your first newsletter, explore our current featured properties at: https://realtycanvas.in/projects
        
        📱 Stay Connected
        Follow us on social media for daily updates and behind-the-scenes content.
        
        You're receiving this email because you subscribed to RealtyCanvas newsletter.
        If you no longer wish to receive these emails, you can unsubscribe at any time.
        
        © 2024 RealtyCanvas. All rights reserved.
      `
    };

    // Send welcome email to subscriber
    await transporter.sendMail(welcomeMailOptions);

    console.log(`Newsletter subscription received from: ${email}`);
    console.log(`Welcome email sent to: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter. Check your email for a welcome message!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ 
      error: 'Failed to process newsletter subscription' 
    }, { status: 500 });
  }
}