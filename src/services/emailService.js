/**
 * Email Service using Resend
 */

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'PODI Posyandu <onboarding@resend.dev>';

/**
 * Send email verification
 */
const sendVerificationEmail = async (email, name, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Verifikasi Email - PODI Posyandu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #EC4899; margin: 0;">PODI Posyandu</h1>
                        <p style="color: #666; margin-top: 5px;">Sistem Informasi Posyandu</p>
                    </div>
                    
                    <h2 style="color: #333;">Halo ${name}! 👋</h2>
                    
                    <p style="color: #555; line-height: 1.6;">
                        Terima kasih telah mendaftar di PODI Posyandu. 
                        Silakan klik tombol di bawah untuk memverifikasi email Anda:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyUrl}" 
                           style="background: linear-gradient(to right, #EC4899, #F43F5E); 
                                  color: white; 
                                  padding: 14px 32px; 
                                  text-decoration: none; 
                                  border-radius: 12px;
                                  font-weight: bold;
                                  display: inline-block;">
                            ✉️ Verifikasi Email
                        </a>
                    </div>
                    
                    <p style="color: #888; font-size: 14px;">
                        Link ini akan kadaluarsa dalam 24 jam.
                    </p>
                    
                    <p style="color: #888; font-size: 12px;">
                        Jika Anda tidak mendaftar di PODI, abaikan email ini.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #aaa; font-size: 12px; text-align: center;">
                        © 2024 PODI Posyandu. All rights reserved.
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error('Failed to send email');
        }

        return data;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Reset Password - PODI Posyandu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #EC4899; margin: 0;">PODI Posyandu</h1>
                        <p style="color: #666; margin-top: 5px;">Sistem Informasi Posyandu</p>
                    </div>
                    
                    <h2 style="color: #333;">Reset Password 🔐</h2>
                    
                    <p style="color: #555; line-height: 1.6;">
                        Halo ${name}, kami menerima permintaan untuk mereset password akun Anda.
                        Klik tombol di bawah untuk membuat password baru:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background: linear-gradient(to right, #EC4899, #F43F5E); 
                                  color: white; 
                                  padding: 14px 32px; 
                                  text-decoration: none; 
                                  border-radius: 12px;
                                  font-weight: bold;
                                  display: inline-block;">
                            🔑 Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #888; font-size: 14px;">
                        Link ini akan kadaluarsa dalam 1 jam.
                    </p>
                    
                    <p style="color: #888; font-size: 12px;">
                        Jika Anda tidak meminta reset password, abaikan email ini.
                        Password Anda akan tetap sama.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #aaa; font-size: 12px; text-align: center;">
                        © 2024 PODI Posyandu. All rights reserved.
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error('Failed to send email');
        }

        return data;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
