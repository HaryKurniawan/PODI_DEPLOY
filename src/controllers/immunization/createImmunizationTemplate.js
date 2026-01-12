const prisma = require('../../config/prisma');

const createImmunizationTemplate = async (req, res) => {
  try {
    const {
      ageRange,
      ageInMonths,
      vaccineList
    } = req.body;

    const template = await prisma.templateImunisasi.create({
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
      id: template.id,
      ageRange: template.rentangUsia,
      ageInMonths: template.usiaInBulan,
      vaccines: template.vaksin.map(v => ({
        id: v.id,
        name: v.nama,
        dose: v.dosis,
        description: v.deskripsi,
        recommendedAge: v.usiaRekomendasi
      }))
    };

    res.json({
      message: 'Immunization template created successfully',
      data: mappedTemplate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createImmunizationTemplate;