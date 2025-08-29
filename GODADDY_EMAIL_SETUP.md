# GoDaddy Email Setup for Lead Capture Modal

## 📧 **Email Configuration Guide**

This guide will help you configure the lead capture modal to send all form submissions to your GoDaddy email address: `sales@realtycanvas.in`

## 🔧 **Setup Steps**

### **Step 1: Configure Environment Variables**

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your GoDaddy email credentials:**
   ```bash
   # GoDaddy Email Configuration
   GODADDY_EMAIL_USER="sales@realtycanvas.in"
   GODADDY_EMAIL_PASS="your_actual_password_here"
   ```

### **Step 2: GoDaddy Email Settings**

**SMTP Configuration for GoDaddy:**
- **SMTP Server:** `smtpout.secureserver.net`
- **Port:** `587` (TLS) or `465` (SSL)
- **Security:** STARTTLS
- **Authentication:** Required

### **Step 3: Enable SMTP Access in GoDaddy**

1. **Log into your GoDaddy account**
2. **Go to Email & Office Dashboard**
3. **Select your email account**
4. **Enable SMTP access** (if not already enabled)
5. **Note your email password** (you'll need this for the environment variable)

### **Step 4: Test the Configuration**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Wait for the lead capture modal to appear** (after 20 seconds)
3. **Fill out the form and submit**
4. **Check your `sales@realtycanvas.in` inbox** for the lead notification

## 📋 **Email Template Features**

The lead capture emails include:

✅ **Professional HTML formatting**  
✅ **Lead details (Name, Phone, Email, Timeline)**  
✅ **Quick action buttons (Call, Email)**  
✅ **Indian timezone timestamp**  
✅ **Branded design with Realty Canvas styling**  
✅ **Mobile-responsive email template**  

## 🔍 **Email Preview**

```
🏠 New Lead from Realty Canvas Website

Lead Details:
👤 Name: John Doe
📞 Phone: +91 9876543210
📧 Email: john@example.com
⏰ Timeline: Within 3 months

Quick Actions:
• Call: +91 9876543210
• Email: john@example.com

Lead captured on: 15/01/2024, 2:30:45 PM IST
```

## 🚨 **Troubleshooting**

### **Common Issues:**

**1. Authentication Failed**
```
Error: Invalid login: 535 Authentication failed
```
**Solution:** 
- Verify your email and password in `.env.local`
- Ensure SMTP is enabled in GoDaddy
- Try using an app-specific password if available

**2. Connection Timeout**
```
Error: Connection timeout
```
**Solution:**
- Check your internet connection
- Verify SMTP server settings
- Try port 465 with SSL instead of 587

**3. Emails Not Received**
**Solution:**
- Check spam/junk folder
- Verify the recipient email address
- Check GoDaddy email quotas and limits

### **Alternative SMTP Settings (if needed):**

```javascript
// For SSL (port 465)
const transporter = nodemailer.createTransporter({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GODADDY_EMAIL_USER,
    pass: process.env.GODADDY_EMAIL_PASS,
  },
});
```

## 📊 **Lead Tracking**

All leads are also logged to the console for debugging:

```javascript
console.log('New lead captured:', {
  name: 'John Doe',
  phone: '+91 9876543210',
  email: 'john@example.com',
  timeline: 'Within 3 months',
  timestamp: '2024-01-15T09:00:45.123Z'
});
```

## 🔐 **Security Best Practices**

1. **Never commit `.env.local` to version control**
2. **Use strong passwords for your email account**
3. **Consider using app-specific passwords**
4. **Regularly rotate email passwords**
5. **Monitor email logs for suspicious activity**

## 📱 **Modal Behavior**

- **Appears after 20 seconds** on first visit
- **Shows only once per user** (uses localStorage)
- **Responsive design** for mobile and desktop
- **Form validation** for required fields
- **Success/error messages** for user feedback

## 🎯 **API Endpoint**

**Endpoint:** `POST /api/lead-capture`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 9876543210",
  "email": "john@example.com",
  "timeline": "Within 3 months"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Lead captured successfully! We will contact you soon."
}
```

**Error Response:**
```json
{
  "error": "Failed to process lead capture",
  "message": "Please try again or contact us directly."
}
```

## 🚀 **Production Deployment**

For production deployment:

1. **Set environment variables** in your hosting platform
2. **Test email delivery** in production environment
3. **Monitor email quotas** and delivery rates
4. **Set up email alerts** for failed deliveries
5. **Consider backup email services** for redundancy

## 📞 **Support**

If you need help with the setup:
1. Check the troubleshooting section above
2. Verify your GoDaddy email settings
3. Test with a simple email client first
4. Contact GoDaddy support for SMTP issues

---

**✅ Setup Complete!** Your lead capture modal will now send all submissions directly to `sales@realtycanvas.in`