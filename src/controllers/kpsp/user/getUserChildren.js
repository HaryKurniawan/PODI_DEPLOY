const prisma = require('../../../config/prisma');

// Get children for KPSP screening (for logged in user)
const getUserChildren = async (req, res) => {
  try {
    const children = await prisma.dataAnak.findMany({
      where: { penggunaId: req.user.id },
      select: {
        id: true,
        namaLengkap: true,
        tanggalLahir: true,
        nik: true,
        urutanAnak: true
      },
      orderBy: {
        urutanAnak: 'asc'
      }
    });

    // Calculate age in months for each child and map to frontend format
    const childrenWithAge = children.map(child => {
      const birthDate = new Date(child.tanggalLahir);
      const today = new Date();
      const ageInMonths = Math.floor(
        (today - birthDate) / (1000 * 60 * 60 * 24 * 30.44)
      );

      // Determine age range
      let ageRange = null;
      if (ageInMonths >= 0 && ageInMonths < 6) ageRange = '0-6';
      else if (ageInMonths >= 6 && ageInMonths < 12) ageRange = '6-12';
      else if (ageInMonths >= 12 && ageInMonths < 18) ageRange = '12-18';
      else if (ageInMonths >= 18 && ageInMonths <= 24) ageRange = '18-24';

      return {
        id: child.id,
        fullName: child.namaLengkap,
        birthDate: child.tanggalLahir,
        nik: child.nik,
        childOrder: child.urutanAnak,
        ageInMonths,
        ageRange
      };
    });

    res.json(childrenWithAge);
  } catch (error) {
    console.error('Error in getUserChildren:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getUserChildren;