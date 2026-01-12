const prisma = require('../../../config/prisma');

// Create development area (Admin)
const createDevelopmentArea = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nama wajib diisi' });
        }

        // Check if already exists
        const existing = await prisma.areaPerkembangan.findUnique({
            where: { nama: name }
        });

        if (existing) {
            return res.status(400).json({ message: 'Area perkembangan dengan nama ini sudah ada' });
        }

        const area = await prisma.areaPerkembangan.create({
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
            message: 'Aspek perkembangan berhasil dibuat',
            data: mappedArea
        });
    } catch (error) {
        console.error('Error in createDevelopmentArea:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = createDevelopmentArea;
