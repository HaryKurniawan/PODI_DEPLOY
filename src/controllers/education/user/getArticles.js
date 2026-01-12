const prisma = require('../../../config/prisma');

// Get published articles with filters
const getArticles = async (req, res) => {
    try {
        const { category, search, limit = 20, page = 1 } = req.query;

        const where = {
            dipublikasikan: true,
            ...(category && { kategori: { slug: category } }),
            ...(search && {
                OR: [
                    { judul: { contains: search, mode: 'insensitive' } },
                    { ringkasan: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const daftarArtikel = await prisma.artikelEdukasi.findMany({
            where,
            orderBy: { dipublikasikanPada: 'desc' },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            include: {
                kategori: {
                    select: { id: true, nama: true, slug: true, warna: true }
                }
            }
        });

        const total = await prisma.artikelEdukasi.count({ where });

        // Map to frontend format
        const articles = daftarArtikel.map(a => ({
            id: a.id,
            categoryId: a.kategoriId,
            title: a.judul,
            slug: a.slug,
            summary: a.ringkasan,
            thumbnail: a.thumbnail,
            type: a.tipe,
            duration: a.durasi,
            isPublished: a.dipublikasikan,
            publishedAt: a.dipublikasikanPada,
            viewCount: a.jumlahDilihat,
            isFeatured: a.unggulan,
            category: a.kategori ? {
                id: a.kategori.id,
                name: a.kategori.nama,
                slug: a.kategori.slug,
                color: a.kategori.warna
            } : null
        }));

        res.json({
            articles,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error in getArticles:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getArticles;
