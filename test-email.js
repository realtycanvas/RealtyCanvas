const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email with:', process.env.GODADDY_EMAIL_USER);

  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587, // Try 587 first
    secure: false, 
    auth: {
      user: process.env.GODADDY_EMAIL_USER,
      pass: process.env.GODADDY_EMAIL_PASS,
    },
    // Add debug options
    logger: true,
    debug: true
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.GODADDY_EMAIL_USER,
      to: process.env.GODADDY_EMAIL_USER, // Send to self
      subject: 'Test Email',
      text: 'This is a test email',
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();
