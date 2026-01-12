const prisma = require('../../config/prisma');

// Get all family data for current user
const getFamilyData = async (req, res) => {
  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: req.user.id },
      include: {
        dataIbu: true,
        dataSuami: true,
        dataAnak: {
          orderBy: {
            urutanAnak: 'asc'
          }
        }
      }
    });

    // Map to frontend expected format
    const response = {
      id: pengguna.id,
      name: pengguna.nama,
      email: pengguna.email,
      motherData: pengguna.dataIbu ? {
        id: pengguna.dataIbu.id,
        fullName: pengguna.dataIbu.namaLengkap,
        phoneNumber: pengguna.dataIbu.noTelepon,
        nik: pengguna.dataIbu.nik,
        birthPlace: pengguna.dataIbu.tempatLahir,
        birthDate: pengguna.dataIbu.tanggalLahir,
        education: pengguna.dataIbu.pendidikan,
        occupation: pengguna.dataIbu.pekerjaan,
        bloodType: pengguna.dataIbu.golonganDarah,
        jkn: pengguna.dataIbu.jkn,
        facilityTK1: pengguna.dataIbu.fasilitasTK1
      } : null,
      spouseData: pengguna.dataSuami ? {
        id: pengguna.dataSuami.id,
        fullName: pengguna.dataSuami.namaLengkap,
        nik: pengguna.dataSuami.nik,
        occupation: pengguna.dataSuami.pekerjaan,
        phoneNumber: pengguna.dataSuami.noTelepon
      } : null,
      childrenData: pengguna.dataAnak.map(anak => ({
        id: anak.id,
        fullName: anak.namaLengkap,
        nik: anak.nik,
        birthCertificate: anak.noAkta,
        childOrder: anak.urutanAnak,
        bloodType: anak.golonganDarah,
        gender: anak.jenisKelamin,
        birthPlace: anak.tempatLahir,
        birthDate: anak.tanggalLahir
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getFamilyData;