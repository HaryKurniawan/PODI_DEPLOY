const prisma = require('../../../config/prisma');

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, icon, color, description, order, isActive } = req.body;

        const kategori = await prisma.kategoriEdukasi.update({
            where: { id },
            data: {
                ...(name && { nama: name }),
                ...(slug && { slug: slug.toLowerCase().replace(/\s+/g, '-') }),
                ...(icon !== undefined && { ikon: icon }),
                ...(color !== undefined && { warna: color }),
                ...(description !== undefined && { deskripsi: description }),
                ...(order !== undefined && { urutan: order }),
                ...(isActive !== undefined && { aktif: isActive })
            }
        });

        // Map to frontend format
        res.json({
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
        console.error('Error in updateCategory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = updateCategory;
