const prisma = require('../../../config/prisma');

// Create KPSP age category (Admin)
const createKPSPCategory = async (req, res) => {
  try {
    const { code, name, minAgeMonths, maxAgeMonths, description } = req.body;

    const category = await prisma.kategoriUsiaKPSP.create({
      data: {
        kode: code,
        nama: name,
        usiaMinBulan: minAgeMonths,
        usiaMaxBulan: maxAgeMonths,
        deskripsi: description
      }
    });

    // Map to frontend format
    const mappedCategory = {
      id: category.id,
      code: category.kode,
      name: category.nama,
      minAgeMonths: category.usiaMinBulan,
      maxAgeMonths: category.usiaMaxBulan,
      description: category.deskripsi,
      isActive: category.aktif
    };

    res.json({
      message: 'Kategori KPSP berhasil dibuat',
      data: mappedCategory
    });
  } catch (error) {
    console.error('Error in createKPSPCategory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createKPSPCategory;