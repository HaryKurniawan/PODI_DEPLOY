const prisma = require('../../../config/prisma');

// Save/bookmark an article
const saveArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const penggunaId = req.user.id;

        // Check if article exists and is published
        const artikel = await prisma.artikelEdukasi.findUnique({
            where: { id: articleId }
        });

        if (!artikel || !artikel.dipublikasikan) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }

        // Check if already saved
        const existing = await prisma.artikelTersimpan.findUnique({
            where: { penggunaId_artikelId: { penggunaId, artikelId: articleId } }
        });

        if (existing) {
            return res.status(400).json({ message: 'Artikel sudah tersimpan' });
        }

        // Save the article
        await prisma.artikelTersimpan.create({
            data: { penggunaId, artikelId: articleId }
        });

        res.json({ message: 'Artikel berhasil disimpan', saved: true });
    } catch (error) {
        console.error('Error in saveArticle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = saveArticle;
