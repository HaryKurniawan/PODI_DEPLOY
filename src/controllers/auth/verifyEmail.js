/**
 * Verify Email Handler
 */

const prisma = require('../../config/prisma');
const crypto = require('crypto');

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token diperlukan' });
        }

        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const pengguna = await prisma.pengguna.findFirst({
            where: {
                tokenVerifikasiEmail: hashedToken,
                kadaluarsaVerifikasiEmail: {
                    gt: new Date()
                }
            }
        });

        if (!pengguna) {
            return res.status(400).json({
                message: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

        // Update user as verified
        await prisma.pengguna.update({
            where: { id: pengguna.id },
            data: {
                emailTerverifikasi: true,
                tokenVerifikasiEmail: null,
                kadaluarsaVerifikasiEmail: null
            }
        });

        res.json({ message: 'Email berhasil diverifikasi. Silakan login.' });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

module.exports = verifyEmail;
