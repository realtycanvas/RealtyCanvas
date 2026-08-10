import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

// Campaign landing pages can copy an extra inbox on top of the sales address.
// Keyed by projectSlug; unset env var simply means no copy is sent.
const EXTRA_LEAD_RECIPIENTS: Record<string, string | undefined> = {
  'vedic-city-goa': process.env.VEDIC_CITY_LEAD_EMAIL,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, timeline, propertyType, city, state, projectSlug, projectTitle, sourcePath } = body;

    // Validate required fields
    if (
      !name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !timeline?.trim() ||
      !propertyType?.trim() ||
      !city?.trim() ||
      !state?.trim()
    ) {
      return NextResponse.json({ error: 'All required fields must be filled in' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate phone format (basic validation for Indian numbers)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Trim all string fields
    const cleanData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      timeline: timeline.trim(),
      propertyType: propertyType.trim(),
      city: city.trim(),
      state: state.trim(),
      projectSlug: projectSlug?.trim() || null,
      projectTitle: projectTitle?.trim() || null,
      sourcePath: sourcePath?.trim() || null,
    };

    // 1. Save to Database First
    let savedLead;
    try {
      savedLead = await prisma.lead.create({
        data: {
          name: cleanData.name,
          phone: cleanData.phone,
          email: cleanData.email,
          propertyType: cleanData.propertyType,
          city: cleanData.city,
          state: cleanData.state,
          timeline: cleanData.timeline,
          projectSlug: cleanData.projectSlug,
          projectTitle: cleanData.projectTitle,
          sourcePath: cleanData.sourcePath,
          status: 'NEW',
        },
      });
    } catch (dbError) {
      console.error('Failed to save lead to database:', dbError);
      // Continue to try sending email even if DB fails
    }

    // 2. Send Email Notification
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net', // GoDaddy SMTP server
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.GODADDY_EMAIL_USER,
          pass: process.env.GODADDY_EMAIL_PASS,
        },
      });

      const sourceInfoHtml =
        cleanData.projectSlug || cleanData.projectTitle || cleanData.sourcePath
          ? `
            <div style="background: #fff7ed; padding: 16px; border-radius: 8px; margin-top: 12px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 15px; color: #7c2d12;">
                <strong>🧭 Lead Source:</strong><br/>
                ${cleanData.projectTitle ? `Property: <strong>${cleanData.projectTitle}</strong><br/>` : ''}
                ${cleanData.projectSlug ? `Slug: <code>${cleanData.projectSlug}</code><br/>` : ''}
                ${cleanData.sourcePath ? `Page: <code>${cleanData.sourcePath}</code>` : ''}
              </p>
            </div>
        `
          : '';

      const extraRecipient = cleanData.projectSlug ? EXTRA_LEAD_RECIPIENTS[cleanData.projectSlug] : undefined;

      const mailOptions = {
        from: process.env.GODADDY_EMAIL_USER,
        to: 'sales@realtycanvas.in',
        ...(extraRecipient ? { cc: extraRecipient } : {}),
        subject: `🏠 New ${cleanData.propertyType} Lead - ${cleanData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🏠 New Lead Captured!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Realty Canvas Website</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Lead Details</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">👤 Name:</strong> ${cleanData.name}</p>
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">📞 Phone:</strong> <a href="tel:${cleanData.phone}" style="color: #333; text-decoration: none;">${cleanData.phone}</a></p>
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">📧 Email:</strong> <a href="mailto:${cleanData.email}" style="color: #333; text-decoration: none;">${cleanData.email}</a></p>
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">${cleanData.propertyType === 'COMMERCIAL' ? '🏢' : '🏠'} Property Type:</strong> ${cleanData.propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'}</p>
                <p style="margin: 0 0 10px 0; font-size: 16px;"><strong style="color: #667eea;">📍 Location:</strong> ${cleanData.city}, ${cleanData.state}</p>
                <p style="margin: 0; font-size: 16px;"><strong style="color: #667eea;">⏰ Timeline:</strong> ${cleanData.timeline}</p>
              </div>
              
              <div style="background: #e8f2ff; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #555; font-size: 14px;">
                  <strong>💡 Quick Actions:</strong><br>
                  • Call: <a href="tel:${cleanData.phone}" style="color: #667eea;">${cleanData.phone}</a><br>
                  • Email: <a href="mailto:${cleanData.email}" style="color: #667eea;">${cleanData.email}</a><br>
                  • Property: ${cleanData.propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'} in ${cleanData.city}, ${cleanData.state}<br>
                  • Timeline: ${cleanData.timeline}
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
- Name: ${cleanData.name}
- Phone: ${cleanData.phone}
- Email: ${cleanData.email}
- Property Type: ${cleanData.propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'}
- Location: ${cleanData.city}, ${cleanData.state}
- Timeline: ${cleanData.timeline}

Lead captured on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Source:
${cleanData.projectTitle ? `- Property: ${cleanData.projectTitle}\n` : ''}${cleanData.projectSlug ? `- Slug: ${cleanData.projectSlug}\n` : ''}${cleanData.sourcePath ? `- Page: ${cleanData.sourcePath}\n` : ''}
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send lead email:', emailError);
      // If DB save was successful, we can still return success but log the email failure
      if (!savedLead) {
        throw emailError; // If both failed, throw error
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We will contact you soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing lead capture:', error);
    return NextResponse.json(
      {
        error: 'Failed to process lead capture',
        message: 'Please try again or contact us directly.',
      },
      { status: 500 }
    );
  }
}
