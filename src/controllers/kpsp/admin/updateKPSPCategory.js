const prisma = require('../../../config/prisma');

// Update KPSP category (Admin)
const updateKPSPCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, minAgeMonths, maxAgeMonths, description, isActive } = req.body;

    const category = await prisma.kategoriUsiaKPSP.update({
      where: { id },
      data: {
        kode: code,
        nama: name,
        usiaMinBulan: minAgeMonths,
        usiaMaxBulan: maxAgeMonths,
        deskripsi: description,
        aktif: isActive
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
      message: 'Kategori KPSP berhasil diperbarui',
      data: mappedCategory
    });
  } catch (error) {
    console.error('Error in updateKPSPCategory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateKPSPCategory;
