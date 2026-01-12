const prisma = require('../../../config/prisma');

// Get KPSP age categories with questions
const getKPSPCategories = async (req, res) => {
  try {
    const categories = await prisma.kategoriUsiaKPSP.findMany({
      where: { aktif: true },
      include: {
        pertanyaan: {
          orderBy: {
            nomorPertanyaan: 'asc'
          }
        }
      },
      orderBy: {
        usiaMinBulan: 'asc'
      }
    });

    // Map to frontend format
    const mappedCategories = categories.map(c => ({
      id: c.id,
      code: c.kode,
      name: c.nama,
      minAgeMonths: c.usiaMinBulan,
      maxAgeMonths: c.usiaMaxBulan,
      description: c.deskripsi,
      isActive: c.aktif,
      questions: c.pertanyaan.map(q => ({
        id: q.id,
        questionNumber: q.nomorPertanyaan,
        questionText: q.teksPertanyaan,
        developmentArea: q.areaPerkembangan,
        instruction: q.instruksi
      }))
    }));

    res.json(mappedCategories);
  } catch (error) {
    console.error('Error in getKPSPCategories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getKPSPCategories;