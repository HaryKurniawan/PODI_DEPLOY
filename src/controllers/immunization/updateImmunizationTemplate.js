const prisma = require('../../config/prisma');

// Update immunization template
const updateImmunizationTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { ageRange, ageInMonths, vaccineList } = req.body;

    // Verify template exists
    const template = await prisma.templateImunisasi.findUnique({
      where: { id },
      include: { vaksin: true }
    });

    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    // Delete existing vaccines
    await prisma.vaksinImunisasi.deleteMany({
      where: { templateId: id }
    });

    // Update template and create new vaccines
    const updated = await prisma.templateImunisasi.update({
      where: { id },
      data: {
        rentangUsia: ageRange,
        usiaInBulan: ageInMonths,
        vaksin: {
          createMany: {
            data: vaccineList.map(vaccine => ({
              nama: vaccine.nama || vaccine.name,
              dosis: vaccine.dosis || vaccine.dose,
              deskripsi: vaccine.deskripsi || vaccine.description || '',
              usiaRekomendasi: vaccine.usiaRekomendasi || vaccine.recommendedAge || ''
            }))
          }
        }
      },
      include: {
        vaksin: true
      }
    });

    // Map to frontend format
    const mappedTemplate = {
      id: updated.id,
      ageRange: updated.rentangUsia,
      ageInMonths: updated.usiaInBulan,
      vaccines: updated.vaksin.map(v => ({
        id: v.id,
        name: v.nama,
        dose: v.dosis,
        description: v.deskripsi,
        recommendedAge: v.usiaRekomendasi
      }))
    };

    res.json({
      message: 'Template imunisasi berhasil diubah',
      data: mappedTemplate
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateImmunizationTemplate;