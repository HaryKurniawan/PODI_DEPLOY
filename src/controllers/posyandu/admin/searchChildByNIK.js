const prisma = require('../../../config/prisma');

const searchChildByNIK = async (req, res) => {
  try {
    const { nik } = req.params;

    const anak = await prisma.dataAnak.findUnique({
      where: { nik },
      include: {
        pengguna: {
          include: {
            dataIbu: true,
            dataSuami: true
          }
        }
      }
    });

    if (!anak) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Map to frontend format
    const response = {
      id: anak.id,
      fullName: anak.namaLengkap,
      nik: anak.nik,
      birthCertificate: anak.noAkta,
      childOrder: anak.urutanAnak,
      bloodType: anak.golonganDarah,
      gender: anak.jenisKelamin,
      birthPlace: anak.tempatLahir,
      birthDate: anak.tanggalLahir,
      user: anak.pengguna ? {
        id: anak.pengguna.id,
        name: anak.pengguna.nama,
        motherData: anak.pengguna.dataIbu ? {
          fullName: anak.pengguna.dataIbu.namaLengkap,
          phoneNumber: anak.pengguna.dataIbu.noTelepon
        } : null,
        spouseData: anak.pengguna.dataSuami ? {
          fullName: anak.pengguna.dataSuami.namaLengkap
        } : null
      } : null
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = searchChildByNIK;
