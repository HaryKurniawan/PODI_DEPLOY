const prisma = require('../../../config/prisma');

// Admin: Get article by slug (including unpublished for preview)
const getArticleBySlugAdmin = async (req, res) => {
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
            isFeatured: artikel.unggulan,
            publishedAt: artikel.dipublikasikanPada,
            viewCount: artikel.jumlahDilihat,
            createdAt: artikel.createdAt,
            updatedAt: artikel.updatedAt,
            category: artikel.kategori ? {
                id: artikel.kategori.id,
                name: artikel.kategori.nama,
                slug: artikel.kategori.slug,
                color: artikel.kategori.warna
            } : null
        });
    } catch (error) {
        console.error('Error in getArticleBySlugAdmin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getArticleBySlugAdmin;
