const prisma = require('../../../config/prisma');

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.kategoriEdukasi.delete({
            where: { id }
        });

        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteCategory;
