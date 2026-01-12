const prisma = require('../../../config/prisma');

// Get all categories (public)
const getCategories = async (req, res) => {
    try {
        const daftarKategori = await prisma.kategoriEdukasi.findMany({
            where: { aktif: true },
            orderBy: { urutan: 'asc' },
            include: {
                _count: {
                    select: { artikel: { where: { dipublikasikan: true } } }
                }
            }
        });

        // Map to frontend format
        const categories = daftarKategori.map(k => ({
            id: k.id,
            name: k.nama,
            slug: k.slug,
            icon: k.ikon,
            color: k.warna,
            description: k.deskripsi,
            order: k.urutan,
            isActive: k.aktif,
            _count: {
                articles: k._count.artikel
            }
        }));

        res.json(categories);
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getCategories;
