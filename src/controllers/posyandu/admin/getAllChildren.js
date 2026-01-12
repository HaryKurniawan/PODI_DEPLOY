const prisma = require('../../../config/prisma');

const getAllChildren = async (req, res) => {
  try {
    const daftarAnak = await prisma.dataAnak.findMany({
      include: {
        pengguna: {
          select: {
            nama: true,
            email: true
          }
        }
      },
      orderBy: {
        namaLengkap: 'asc'
      }
    });

    // Map to frontend format
    const children = daftarAnak.map(a => ({
      id: a.id,
      fullName: a.namaLengkap,
      nik: a.nik,
      birthCertificate: a.noAkta,
      childOrder: a.urutanAnak,
      bloodType: a.golonganDarah,
      gender: a.jenisKelamin,
      birthPlace: a.tempatLahir,
      birthDate: a.tanggalLahir,
      user: a.pengguna ? {
        name: a.pengguna.nama,
        email: a.pengguna.email
      } : null
    }));

    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllChildren;