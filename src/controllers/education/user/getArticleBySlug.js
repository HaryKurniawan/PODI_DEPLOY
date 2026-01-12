const prisma = require('../../../config/prisma');

// Get article by slug and increment view count
const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const artikel = await prisma.artikelEdukasi.findUnique({
            where: { slug },
            include: {
                kategori: {
                    select: { id: true, nama: true, slug: true, warna: true }
                }
            }
        });

        if (!artikel) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }

        if (!artikel.dipublikasikan) {
            return res.status(404).json({ message: 'Artikel tidak tersedia' });
        }

        // Increment view count
        await prisma.artikelEdukasi.update({
            where: { id: artikel.id },
            data: { jumlahDilihat: { increment: 1 } }
        });

        // Map to frontend format
        res.json({
            id: artikel.id,
            categoryId: artikel.kategoriId,
            title: artikel.judul,
            slug: artikel.slug,
            content: artikel.konten,
            summary: artikel.ringkasan,
            thumbnail: artikel.thumbnail,
            type: artikel.tipe,
            duration: artikel.durasi,
            isPublished: artikel.dipublikasikan,
            publishedAt: artikel.dipublikasikanPada,
            viewCount: artikel.jumlahDilihat + 1,
            isFeatured: artikel.unggulan,
            category: artikel.kategori ? {
                id: artikel.kategori.id,
                name: artikel.kategori.nama,
                slug: artikel.kategori.slug,
                color: artikel.kategori.warna
            } : null
        });
    } catch (error) {
        console.error('Error in getArticleBySlug:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getArticleBySlug;
