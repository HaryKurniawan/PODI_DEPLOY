const prisma = require('../../../config/prisma');

// Get user's saved articles
const getSavedArticles = async (req, res) => {
    try {
        const penggunaId = req.user.id;

        const daftarArtikelTersimpan = await prisma.artikelTersimpan.findMany({
            where: { penggunaId },
            orderBy: { createdAt: 'desc' },
            include: {
                artikel: {
                    include: {
                        kategori: {
                            select: { id: true, nama: true, slug: true, warna: true }
                        }
                    }
                }
            }
        });

        // Transform to return articles in frontend format
        const articles = daftarArtikelTersimpan.map(sa => ({
            id: sa.artikel.id,
            categoryId: sa.artikel.kategoriId,
            title: sa.artikel.judul,
            slug: sa.artikel.slug,
            summary: sa.artikel.ringkasan,
            thumbnail: sa.artikel.thumbnail,
            type: sa.artikel.tipe,
            duration: sa.artikel.durasi,
            isPublished: sa.artikel.dipublikasikan,
            publishedAt: sa.artikel.dipublikasikanPada,
            viewCount: sa.artikel.jumlahDilihat,
            category: sa.artikel.kategori ? {
                id: sa.artikel.kategori.id,
                name: sa.artikel.kategori.nama,
                slug: sa.artikel.kategori.slug,
                color: sa.artikel.kategori.warna
            } : null,
            savedAt: sa.createdAt
        }));

        res.json(articles);
    } catch (error) {
        console.error('Error in getSavedArticles:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getSavedArticles;
