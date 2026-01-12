const prisma = require('../../../config/prisma');

// Unsave/remove bookmark from an article
const unsaveArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const penggunaId = req.user.id;

        // Delete the saved article
        await prisma.artikelTersimpan.deleteMany({
            where: { penggunaId, artikelId: articleId }
        });

        res.json({ message: 'Artikel berhasil dihapus dari simpanan', saved: false });
    } catch (error) {
        console.error('Error in unsaveArticle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = unsaveArticle;
