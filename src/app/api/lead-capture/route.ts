import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, timeline, propertyType, city, state, projectSlug, projectTitle, sourcePath } = await request.json();

    // Validate required fields
    if (!name || !phone || !email || !propertyType || !city || !state) {
      return NextResponse.json(
        { error: 'Name, phone, email, property type, city, and state are required' },
        { status: 400 }
      );
    }

    // Create transporter for sending emails
    // You'll need to configure this with your email service credentials
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net', // GoDaddy SMTP server
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GODADDY_EMAIL_USER, // Your GoDaddy email
        pass: process.env.GODADDY_EMAIL_PASS, // Your GoDaddy email password
      },
    });

    // Email content
    const sourceInfoHtml = projectSlug || projectTitle || sourcePath
      ? `
            <div style="background: #fff7ed; padding: 16px; border-radius: 8px; margin-top: 12px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 15px; color: #7c2d12;">
                <strong>🧭 Lead Source:</strong><br/>
                ${projectTitle ? `Property: <strong>${projectTitle}</strong><br/>` : ''}
                ${projectSlug ? `Slug: <code>${projectSlug}</code><br/>` : ''}
                ${sourcePath ? `Page: <code>${sourcePath}</code>` : ''}
              </p>
            </div>
        `
      : '';

    const mailOptions = {
      from: process.env.GODADDY_EMAIL_USER,
      to: 'sales@realtycanvas.in',
      subject: '🏠 New Lead from Realty Canvas Website',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏠 New Lead Captured!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Realty Canvas Website</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Lead Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">👤 Name:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">📞 Phone:</strong> <a href="tel:${phone}" style="color: #333; text-decoration: none;">${phone}</a></p>
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">📧 Email:</strong> <a href="mailto:${email}" style="color: #333; text-decoration: none;">${email}</a></p>
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">${propertyType === 'COMMERCIAL' ? '🏢' : '🏠'} Property Type:</strong> ${propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'}</p>
              <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">📍 Location:</strong> ${city}, ${state}</p>
              <p style="margin: 0; font-size: 16px;"><strong style="color: #667eea;">⏰ Timeline:</strong> ${timeline || 'Not specified'}</p>
            </div>
            
            <div style="background: #e8f2ff; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #555; font-size: 14px;">
                <strong>💡 Quick Actions:</strong><br>
                • Call: <a href="tel:${phone}" style="color: #667eea;">${phone}</a><br>
                • Email: <a href="mailto:${email}" style="color: #667eea;">${email}</a><br>
                • Property: ${propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'} in ${city}, ${state}<br>
                • Timeline: ${timeline || 'Ask about their timeline'}
              </p>
            </div>
            ${sourceInfoHtml}
          </div>
          
          <div style="background: #333; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;">
            <p style="margin: 0; opacity: 0.8;">Lead captured on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Realty Canvas - Your Property Partner</p>
          </div>
        </div>
      `,
      text: `
New Lead from Realty Canvas Website

Lead Details:
- Name: ${name}
- Phone: ${phone}
- Email: ${email}
- Property Type: ${propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'}
- Location: ${city}, ${state}
- Timeline: ${timeline || 'Not specified'}

Lead captured on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Source:
${projectTitle ? `- Property: ${projectTitle}\n` : ''}${projectSlug ? `- Slug: ${projectSlug}\n` : ''}${sourcePath ? `- Page: ${sourcePath}\n` : ''}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log the lead for debugging
    console.log('New lead captured:', {
      name,
      phone,
      email,
      propertyType,
      city,
      state,
      timeline,
      projectSlug,
      projectTitle,
      sourcePath,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead captured successfully! We will contact you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing lead capture:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process lead capture', 
        message: 'Please try again or contact us directly.' 
      },
      { status: 500 }
    );
  }
}
