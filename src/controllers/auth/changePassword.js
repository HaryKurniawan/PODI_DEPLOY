const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Password saat ini dan password baru diperlukan' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password minimal 6 karakter' });
        }

        // Get user
        const pengguna = await prisma.pengguna.findUnique({
            where: { id: userId }
        });

        if (!pengguna) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, pengguna.kataSandi);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password saat ini salah' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await prisma.pengguna.update({
            where: { id: userId },
            data: { kataSandi: hashedPassword }
        });

        res.json({ message: 'Password berhasil diubah' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = changePassword;
