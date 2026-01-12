const prisma = require('../../../config/prisma');

// Check if an article is saved by user
const checkSaved = async (req, res) => {
    try {
        const { articleId } = req.params;
        const penggunaId = req.user.id;

        const saved = await prisma.artikelTersimpan.findUnique({
            where: { penggunaId_artikelId: { penggunaId, artikelId: articleId } }
        });

        res.json({ saved: !!saved });
    } catch (error) {
        console.error('Error in checkSaved:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = checkSaved;
