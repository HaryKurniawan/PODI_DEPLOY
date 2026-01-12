const prisma = require('../../config/prisma');

// Get complete family data by child ID
const getFamilyDataByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    // Get child data
    const childData = await prisma.dataAnak.findUnique({
      where: { id: childId },
      include: {
        pengguna: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      }
    });

    if (!childData) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    // Get mother data
    const motherData = await prisma.dataIbu.findUnique({
      where: { penggunaId: childData.penggunaId }
    });

    // Get spouse data
    const spouseData = await prisma.dataSuami.findUnique({
      where: { penggunaId: childData.penggunaId }
    });

    // Get all siblings
    const siblings = await prisma.dataAnak.findMany({
      where: {
        penggunaId: childData.penggunaId,
        id: { not: childId }
      },
      orderBy: {
        urutanAnak: 'asc'
      }
    });

    // Map to frontend format
    res.json({
      childData: {
        id: childData.id,
        fullName: childData.namaLengkap,
        nik: childData.nik,
        birthCertificate: childData.noAkta,
        childOrder: childData.urutanAnak,
        bloodType: childData.golonganDarah,
        gender: childData.jenisKelamin,
        birthPlace: childData.tempatLahir,
        birthDate: childData.tanggalLahir,
        userId: childData.penggunaId,
        user: childData.pengguna ? {
          id: childData.pengguna.id,
          name: childData.pengguna.nama,
          email: childData.pengguna.email
        } : null
      },
      motherData: motherData ? {
        id: motherData.id,
        fullName: motherData.namaLengkap,
        nik: motherData.nik,
        phoneNumber: motherData.noTelepon,
        birthPlace: motherData.tempatLahir,
        birthDate: motherData.tanggalLahir,
        education: motherData.pendidikan,
        occupation: motherData.pekerjaan,
        bloodType: motherData.golonganDarah
      } : null,
      spouseData: spouseData ? {
        id: spouseData.id,
        fullName: spouseData.namaLengkap,
        nik: spouseData.nik,
        phoneNumber: spouseData.noTelepon,
        occupation: spouseData.pekerjaan
      } : null,
      siblings: siblings.map(s => ({
        id: s.id,
        fullName: s.namaLengkap,
        nik: s.nik,
        childOrder: s.urutanAnak,
        birthDate: s.tanggalLahir,
        gender: s.jenisKelamin
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getFamilyDataByChildId;