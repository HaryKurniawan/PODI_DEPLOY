const prisma = require('../../config/prisma');

// Get all immunization templates
const getAllImmunizationTemplates = async (req, res) => {
  try {
    const templates = await prisma.templateImunisasi.findMany({
      include: {
        vaksin: {
          orderBy: {
            dosis: 'asc'
          }
        }
      },
      orderBy: {
        usiaInBulan: 'asc'
      }
    });

    // Map to frontend format
    const mappedTemplates = templates.map(t => ({
      id: t.id,
      ageRange: t.rentangUsia,
      ageInMonths: t.usiaInBulan,
      vaccines: t.vaksin.map(v => ({
        id: v.id,
        name: v.nama,
        dose: v.dosis,
        description: v.deskripsi,
        recommendedAge: v.usiaRekomendasi
      })),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    res.json(mappedTemplates);
  } catch (error) {
    console.error('❌ Error fetching immunization templates:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllImmunizationTemplates;
