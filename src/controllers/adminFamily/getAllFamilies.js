const prisma = require('../../config/prisma');

// Get all families with complete data
const getAllFamilies = async (req, res) => {
  try {
    const families = await prisma.pengguna.findMany({
      where: {
        peran: 'USER',
        sudahLengkapiProfil: true
      },
      include: {
        dataIbu: true,
        dataSuami: true,
        dataAnak: {
          orderBy: {
            urutanAnak: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map to frontend format
    const mappedFamilies = families.map(f => ({
      id: f.id,
      name: f.nama,
      email: f.email,
      role: f.peran,
      hasCompletedProfile: f.sudahLengkapiProfil,
      createdAt: f.createdAt,
      motherData: f.dataIbu ? {
        id: f.dataIbu.id,
        fullName: f.dataIbu.namaLengkap,
        nik: f.dataIbu.nik,
        phoneNumber: f.dataIbu.noTelepon,
        birthPlace: f.dataIbu.tempatLahir,
        birthDate: f.dataIbu.tanggalLahir
      } : null,
      spouseData: f.dataSuami ? {
        id: f.dataSuami.id,
        fullName: f.dataSuami.namaLengkap,
        nik: f.dataSuami.nik,
        phoneNumber: f.dataSuami.noTelepon
      } : null,
      childrenData: f.dataAnak.map(c => ({
        id: c.id,
        fullName: c.namaLengkap,
        nik: c.nik,
        birthDate: c.tanggalLahir,
        gender: c.jenisKelamin,
        childOrder: c.urutanAnak
      }))
    }));

    res.json(mappedFamilies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllFamilies;
