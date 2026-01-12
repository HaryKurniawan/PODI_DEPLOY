const prisma = require('../../../config/prisma');

// Update development area (Admin)
const updateDevelopmentArea = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nama wajib diisi' });
        }

        // Check if exists
        const existing = await prisma.areaPerkembangan.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ message: 'Area perkembangan tidak ditemukan' });
        }

        // Check if name is taken by another area
        const nameTaken = await prisma.areaPerkembangan.findFirst({
            where: {
                nama: name,
                id: { not: id }
            }
        });

        if (nameTaken) {
            return res.status(400).json({ message: 'Area perkembangan dengan nama ini sudah ada' });
        }

        const area = await prisma.areaPerkembangan.update({
            where: { id },
            data: {
                nama: name,
                deskripsi: description
            }
        });

        // Map to frontend format
        const mappedArea = {
            id: area.id,
            name: area.nama,
            description: area.deskripsi,
            isActive: area.aktif
        };

        res.json({
            message: 'Aspek perkembangan berhasil diperbarui',
            data: mappedArea
        });
    } catch (error) {
        console.error('Error in updateDevelopmentArea:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = updateDevelopmentArea;
