const prisma = require('../../config/prisma');

// Save spouse data
const saveSpouseData = async (req, res) => {
  try {
    const { fullName, nik, occupation, phoneNumber } = req.body;

    // Check if NIK is already used by another spouse
    const existingNik = await prisma.dataSuami.findFirst({
      where: {
        nik,
        NOT: { penggunaId: req.user.id }
      }
    });

    if (existingNik) {
      return res.status(400).json({
        message: 'NIK sudah terdaftar oleh pengguna lain',
        field: 'nik'
      });
    }

    const dataSuami = await prisma.dataSuami.upsert({
      where: { penggunaId: req.user.id },
      update: {
        namaLengkap: fullName,
        nik,
        pekerjaan: occupation,
        noTelepon: phoneNumber
      },
      create: {
        penggunaId: req.user.id,
        namaLengkap: fullName,
        nik,
        pekerjaan: occupation,
        noTelepon: phoneNumber
      }
    });

    // Map to frontend format
    res.json({
      message: 'Spouse data saved successfully',
      data: {
        id: dataSuami.id,
        fullName: dataSuami.namaLengkap,
        nik: dataSuami.nik,
        occupation: dataSuami.pekerjaan,
        phoneNumber: dataSuami.noTelepon
      }
    });
  } catch (error) {
    // Handle unique constraint error
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return res.status(400).json({
        message: `${field === 'nik' ? 'NIK' : field} sudah terdaftar`,
        field
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = saveSpouseData;
