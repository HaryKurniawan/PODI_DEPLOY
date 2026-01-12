const prisma = require('../../../config/prisma');

// Update article
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, title, slug, content, summary, thumbnail, type, duration, isPublished, isFeatured } = req.body;

        // Get current article
        const currentArtikel = await prisma.artikelEdukasi.findUnique({
            where: { id }
        });

        if (!currentArtikel) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }

        // Set publishedAt if article is being published for first time
        let dipublikasikanPada = currentArtikel.dipublikasikanPada;
        if (isPublished && !currentArtikel.dipublikasikan) {
            dipublikasikanPada = new Date();
        }

        const artikel = await prisma.artikelEdukasi.update({
            where: { id },
            data: {
                ...(categoryId && { kategoriId: categoryId }),
                ...(title && { judul: title }),
                ...(slug && { slug: slug.toLowerCase().replace(/\s+/g, '-') }),
                ...(content && { konten: content }),
                ...(summary !== undefined && { ringkasan: summary }),
                ...(thumbnail !== undefined && { thumbnail }),
                ...(type && { tipe: type }),
                ...(duration !== undefined && { durasi: duration }),
                ...(isPublished !== undefined && { dipublikasikan: isPublished }),
                ...(isFeatured !== undefined && { unggulan: isFeatured }),
                dipublikasikanPada
            },
            include: {
                kategori: {
                    select: { id: true, nama: true, slug: true }
                }
            }
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
            isFeatured: artikel.unggulan,
            publishedAt: artikel.dipublikasikanPada,
            category: artikel.kategori ? {
                id: artikel.kategori.id,
                name: artikel.kategori.nama,
                slug: artikel.kategori.slug
            } : null
        });
    } catch (error) {
        console.error('Error in updateArticle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = updateArticle;
