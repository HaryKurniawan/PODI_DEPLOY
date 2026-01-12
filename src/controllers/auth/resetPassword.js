/**
 * Reset Password Handler
 */

const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token dan password baru diperlukan' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password minimal 6 karakter' });
        }

        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const pengguna = await prisma.pengguna.findFirst({
            where: {
                tokenResetPassword: hashedToken,
                kadaluarsaResetPassword: {
                    gt: new Date()
                }
            }
        });

        if (!pengguna) {
            return res.status(400).json({
                message: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear reset token
        await prisma.pengguna.update({
            where: { id: pengguna.id },
            data: {
                password: hashedPassword,
                tokenResetPassword: null,
                kadaluarsaResetPassword: null
            }
        });

        res.json({ message: 'Password berhasil diubah. Silakan login.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

module.exports = resetPassword;
