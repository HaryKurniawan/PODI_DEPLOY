const prisma = require('../../../config/prisma');

// Check if slug is available
const checkSlugAvailability = async (req, res) => {
    try {
        const { slug } = req.params;
        const { excludeId } = req.query;

        if (!slug) {
            return res.status(400).json({ message: 'Slug wajib diisi' });
        }

        const whereClause = { slug: slug.toLowerCase() };

        if (excludeId) {
            whereClause.NOT = { id: excludeId };
        }

        const existing = await prisma.artikelEdukasi.findFirst({
            where: whereClause
        });

        res.json({
            available: !existing,
            message: existing ? 'Slug sudah digunakan' : 'Slug tersedia'
        });
    } catch (error) {
        console.error('Error in checkSlugAvailability:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = checkSlugAvailability;
