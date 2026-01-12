const prisma = require('../../../config/prisma');

// Get all development areas (Admin)
const getDevelopmentAreas = async (req, res) => {
    try {
        const areas = await prisma.areaPerkembangan.findMany({
            where: { aktif: true },
            orderBy: { nama: 'asc' }
        });

        // Map to frontend format
        const mappedAreas = areas.map(a => ({
            id: a.id,
            name: a.nama,
            description: a.deskripsi,
            isActive: a.aktif
        }));

        res.json(mappedAreas);
    } catch (error) {
        console.error('Error in getDevelopmentAreas:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getDevelopmentAreas;
