const prisma = require('../../../config/prisma');

// Delete (soft) development area (Admin)
const deleteDevelopmentArea = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if exists
        const existing = await prisma.areaPerkembangan.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ message: 'Area perkembangan tidak ditemukan' });
        }

        // Soft delete - set aktif to false
        await prisma.areaPerkembangan.update({
            where: { id },
            data: { aktif: false }
        });

        res.json({
            message: 'Aspek perkembangan berhasil dihapus'
        });
    } catch (error) {
        console.error('Error in deleteDevelopmentArea:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteDevelopmentArea;
