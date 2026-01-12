/**
 * Resend Verification Email Handler
 */

const prisma = require('../../config/prisma');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../../services/emailService');

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email diperlukan' });
        }

        const pengguna = await prisma.pengguna.findUnique({
            where: { email }
        });

        if (!pengguna) {
            return res.json({
                message: 'Jika email terdaftar, Anda akan menerima link verifikasi'
            });
        }

        if (pengguna.emailTerverifikasi) {
            return res.status(400).json({ message: 'Email sudah terverifikasi' });
        }

        // Generate new verification token
        const verifyToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Save token to database
        await prisma.pengguna.update({
            where: { id: pengguna.id },
            data: {
                tokenVerifikasiEmail: hashedToken,
                kadaluarsaVerifikasiEmail: expires
            }
        });

        // Send email
        try {
            await sendVerificationEmail(pengguna.email, pengguna.nama, verifyToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            return res.status(500).json({ message: 'Gagal mengirim email' });
        }

        res.json({
            message: 'Email verifikasi telah dikirim'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

module.exports = resendVerification;
