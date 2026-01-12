const prisma = require('../../config/prisma');

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Nama tidak boleh kosong' });
        }

        const updatedPengguna = await prisma.pengguna.update({
            where: { id: req.user.id },
            data: {
                nama: name.trim()
            },
            select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                sudahLengkapiProfil: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({
            message: 'Profil berhasil diperbarui',
            user: {
                id: updatedPengguna.id,
                name: updatedPengguna.nama,
                email: updatedPengguna.email,
                role: updatedPengguna.role,
                hasCompletedProfile: updatedPengguna.sudahLengkapiProfil,
                createdAt: updatedPengguna.createdAt,
                updatedAt: updatedPengguna.updatedAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = updateProfile;
