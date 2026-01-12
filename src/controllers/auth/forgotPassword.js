/**
 * Forgot Password Handler
 */

const prisma = require('../../config/prisma');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../../services/emailService');

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email diperlukan' });
        }

        const pengguna = await prisma.pengguna.findUnique({
            where: { email }
        });

        // Don't reveal if user exists or not
        if (!pengguna) {
            return res.json({
                message: 'Jika email terdaftar, Anda akan menerima link reset password'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token to database
        await prisma.pengguna.update({
            where: { id: pengguna.id },
            data: {
                tokenResetPassword: hashedToken,
                kadaluarsaResetPassword: expires
            }
        });

        // Send email
        try {
            await sendPasswordResetEmail(pengguna.email, pengguna.nama, resetToken);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // Still return success to not reveal user existence
        }

        res.json({
            message: 'Jika email terdaftar, Anda akan menerima link reset password'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

module.exports = forgotPassword;
