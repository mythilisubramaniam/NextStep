const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP email
exports.sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"Next Step" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP - Next Step',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; margin-bottom: 30px; }
                        .otp-box { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #212529; }
                        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="color: #212529;">Password Reset Request</h2>
                        </div>
                        
                        <p>Hello,</p>
                        <p>You requested to reset your password for your Next Step account. Use the OTP below to complete the process:</p>
                        
                        <div class="otp-box">
                            <div class="otp-code">${otp}</div>
                        </div>
                        
                        <p><strong>This OTP will expire in 10 minutes.</strong></p>
                        
                        <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                        
                        <div class="footer">
                            <p>© 2026 Next Step. All rights reserved.</p>
                            <p>This is an automated email, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('Email service is ready to send emails');
        return true;
    } catch (error) {
        console.error('Email service configuration error:', error);
        return false;
    }
};
