const prisma = require('../../../config/prisma');

// Delete KPSP question (Admin)
const deleteKPSPQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.pertanyaanKPSP.delete({
      where: { id }
    });

    res.json({ message: 'Pertanyaan KPSP berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteKPSPQuestion:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = deleteKPSPQuestion;