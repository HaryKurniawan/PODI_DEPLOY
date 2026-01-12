const prisma = require('../../config/prisma');

// Save mother data
const saveMotherData = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      nik,
      birthPlace,
      birthDate,
      education,
      occupation,
      bloodType,
      jkn,
      facilityTK1
    } = req.body;

    // Check if NIK is already used by another mother
    const existingNik = await prisma.dataIbu.findFirst({
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

    const dataIbu = await prisma.dataIbu.upsert({
      where: { penggunaId: req.user.id },
      update: {
        namaLengkap: fullName,
        noTelepon: phoneNumber,
        nik,
        tempatLahir: birthPlace,
        tanggalLahir: new Date(birthDate),
        pendidikan: education,
        pekerjaan: occupation,
        golonganDarah: bloodType,
        jkn,
        fasilitasTK1: facilityTK1
      },
      create: {
        penggunaId: req.user.id,
        namaLengkap: fullName,
        noTelepon: phoneNumber,
        nik,
        tempatLahir: birthPlace,
        tanggalLahir: new Date(birthDate),
        pendidikan: education,
        pekerjaan: occupation,
        golonganDarah: bloodType,
        jkn,
        fasilitasTK1: facilityTK1
      }
    });

    // Map to frontend format
    res.json({
      message: 'Mother data saved successfully',
      data: {
        id: dataIbu.id,
        fullName: dataIbu.namaLengkap,
        phoneNumber: dataIbu.noTelepon,
        nik: dataIbu.nik,
        birthPlace: dataIbu.tempatLahir,
        birthDate: dataIbu.tanggalLahir,
        education: dataIbu.pendidikan,
        occupation: dataIbu.pekerjaan,
        bloodType: dataIbu.golonganDarah,
        jkn: dataIbu.jkn,
        facilityTK1: dataIbu.fasilitasTK1
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

module.exports = saveMotherData;