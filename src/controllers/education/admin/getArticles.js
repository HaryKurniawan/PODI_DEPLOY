const prisma = require('../../../config/prisma');

// Get all articles for admin (including unpublished)
const getArticles = async (req, res) => {
    try {
        const { category, search } = req.query;

        const where = {
            ...(category && { kategoriId: category }),
            ...(search && {
                OR: [
                    { judul: { contains: search, mode: 'insensitive' } },
                    { ringkasan: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const daftarArtikel = await prisma.artikelEdukasi.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                kategori: {
                    select: { id: true, nama: true, slug: true, warna: true }
                }
            }
        });

        // Map to frontend format
        const articles = daftarArtikel.map(a => ({
            id: a.id,
            categoryId: a.kategoriId,
            title: a.judul,
            slug: a.slug,
            content: a.konten,
            summary: a.ringkasan,
            thumbnail: a.thumbnail,
            type: a.tipe,
            duration: a.durasi,
            isPublished: a.dipublikasikan,
            publishedAt: a.dipublikasikanPada,
            viewCount: a.jumlahDilihat,
            isFeatured: a.unggulan,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            category: a.kategori ? {
                id: a.kategori.id,
                name: a.kategori.nama,
                slug: a.kategori.slug,
                color: a.kategori.warna
            } : null
        }));

        res.json(articles);
    } catch (error) {
        console.error('Error in admin getArticles:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getArticles;
