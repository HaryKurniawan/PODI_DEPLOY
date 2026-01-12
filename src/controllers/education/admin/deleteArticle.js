const prisma = require('../../../config/prisma');

// Delete article
const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.artikelEdukasi.delete({
            where: { id }
        });

        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteArticle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteArticle;
