const prisma = require('../../../config/prisma');

// Delete KPSP category (Admin)
const deleteKPSPCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.kategoriUsiaKPSP.delete({
      where: { id }
    });

    res.json({ message: 'Kategori KPSP berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteKPSPCategory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = deleteKPSPCategory;
