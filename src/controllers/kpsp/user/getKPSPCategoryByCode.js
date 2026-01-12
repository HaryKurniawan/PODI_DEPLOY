const prisma = require('../../../config/prisma');

// Get KPSP category by code
const getKPSPCategoryByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const category = await prisma.kategoriUsiaKPSP.findUnique({
      where: { kode: code },
      include: {
        pertanyaan: {
          orderBy: {
            nomorPertanyaan: 'asc'
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Kategori KPSP tidak ditemukan' });
    }

    // Map to frontend format
    const mappedCategory = {
      id: category.id,
      code: category.kode,
      name: category.nama,
      minAgeMonths: category.usiaMinBulan,
      maxAgeMonths: category.usiaMaxBulan,
      description: category.deskripsi,
      isActive: category.aktif,
      questions: category.pertanyaan.map(q => ({
        id: q.id,
        questionNumber: q.nomorPertanyaan,
        questionText: q.teksPertanyaan,
        developmentArea: q.areaPerkembangan,
        instruction: q.instruksi
      }))
    };

    res.json(mappedCategory);
  } catch (error) {
    console.error('Error in getKPSPCategoryByCode:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getKPSPCategoryByCode;