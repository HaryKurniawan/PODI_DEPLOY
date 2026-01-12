const prisma = require('../../../config/prisma');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, slug, icon, color, description, order } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Nama dan slug wajib diisi' });
        }

        // Check if slug already exists
        const existing = await prisma.kategoriEdukasi.findUnique({
            where: { slug }
        });

        if (existing) {
            return res.status(400).json({ message: 'Slug sudah digunakan' });
        }

        const kategori = await prisma.kategoriEdukasi.create({
            data: {
                nama: name,
                slug: slug.toLowerCase().replace(/\s+/g, '-'),
                ikon: icon,
                warna: color,
                deskripsi: description,
                urutan: order || 0
            }
        });

        // Map to frontend format
        res.status(201).json({
            id: kategori.id,
            name: kategori.nama,
            slug: kategori.slug,
            icon: kategori.ikon,
            color: kategori.warna,
            description: kategori.deskripsi,
            order: kategori.urutan,
            isActive: kategori.aktif
        });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = createCategory;
