const prisma = require('../../../config/prisma');

// Create article
const createArticle = async (req, res) => {
    try {
        const { categoryId, title, slug, content, summary, thumbnail, type, duration, isPublished, isFeatured } = req.body;

        if (!categoryId || !title || !slug || !content) {
            return res.status(400).json({ message: 'Kategori, judul, slug, dan konten wajib diisi' });
        }

        // Check if slug already exists
        const existing = await prisma.artikelEdukasi.findUnique({
            where: { slug }
        });

        if (existing) {
            return res.status(400).json({ message: 'Slug sudah digunakan' });
        }

        const artikel = await prisma.artikelEdukasi.create({
            data: {
                kategoriId: categoryId,
                judul: title,
                slug: slug.toLowerCase().replace(/\s+/g, '-'),
                konten: content,
                ringkasan: summary,
                thumbnail,
                tipe: type || 'ARTIKEL',
                durasi: duration,
                dipublikasikan: isPublished || false,
                unggulan: isFeatured || false,
                dipublikasikanPada: isPublished ? new Date() : null
            },
            include: {
                kategori: {
                    select: { id: true, nama: true, slug: true }
                }
            }
        });

        // Map to frontend format
        res.status(201).json({
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
            category: artikel.kategori ? {
                id: artikel.kategori.id,
                name: artikel.kategori.nama,
                slug: artikel.kategori.slug
            } : null
        });
    } catch (error) {
        console.error('Error in createArticle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = createArticle;
