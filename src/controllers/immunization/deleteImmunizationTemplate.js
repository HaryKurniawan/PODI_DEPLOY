const prisma = require('../../config/prisma');

const deleteImmunizationTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify template exists
    const template = await prisma.templateImunisasi.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    // Delete associated vaccines first
    await prisma.vaksinImunisasi.deleteMany({
      where: { templateId: id }
    });

    // Delete template
    await prisma.templateImunisasi.delete({
      where: { id }
    });

    res.json({ message: 'Template imunisasi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = deleteImmunizationTemplate;