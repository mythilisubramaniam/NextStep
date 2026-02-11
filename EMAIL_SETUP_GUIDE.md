# Email Setup Guide for Nodemailer

## Gmail Configuration (Recommended for Development)

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification"
4. Follow the setup process

### Step 2: Generate App Password
1. After enabling 2-Step Verification, go back to Security
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" as the device
5. Enter "Next Step App" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: xxxx xxxx xxxx xxxx)

### Step 3: Update .env File
Open your `.env` file and update:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

Replace:
- `your-actual-email@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the app password you generated

### Step 4: Restart Your Server
After updating .env, restart your Node.js server:
```bash
# Stop the server (Ctrl+C)
# Start again
node server.js
```

---

## Alternative: Using Other Email Services

### Outlook/Hotmail
```javascript
service: 'outlook'
```

### Yahoo
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
host: 'smtp.example.com',
port: 587,
secure: false,
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
```

---

## Testing

1. Go to: http://localhost:3000/forgotPassword
2. Enter a registered email address
3. Check your email inbox for the OTP
4. If email fails, check the console - OTP will still be logged there

---

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled

### "Connection timeout" error
- Check your internet connection
- Try a different email service
- Check if your firewall is blocking port 587

### Email not received
- Check spam/junk folder
- Verify the email address is correct
- Check console logs for errors

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit your `.env` file to Git
- Keep your app password secure
- Use environment variables in production
- Consider using professional email services (SendGrid, AWS SES) for production

---

## Production Recommendations

For production, consider using:
- **SendGrid** (100 free emails/day)
- **AWS SES** (62,000 free emails/month)
- **Mailgun** (5,000 free emails/month)

These services are more reliable and provide better deliverability than Gmail.
