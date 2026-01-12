const prisma = require('../../config/prisma');

const deleteChildImmunization = async (req, res) => {
  try {
    const { immunizationId } = req.params;

    const immunization = await prisma.imunisasiAnak.findUnique({
      where: { id: immunizationId }
    });

    if (!immunization) {
      return res.status(404).json({ message: 'Catatan imunisasi tidak ditemukan' });
    }

    await prisma.imunisasiAnak.delete({
      where: { id: immunizationId }
    });

    res.json({ message: 'Catatan imunisasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = deleteChildImmunization;