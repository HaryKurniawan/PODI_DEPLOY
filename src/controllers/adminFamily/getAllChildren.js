const prisma = require('../../config/prisma');

// Get all children with their family data
const getAllChildren = async (req, res) => {
  try {
    const children = await prisma.dataAnak.findMany({
      include: {
        pengguna: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map to frontend format
    const mappedChildren = children.map(c => ({
      id: c.id,
      fullName: c.namaLengkap,
      nik: c.nik,
      birthCertificate: c.noAkta,
      childOrder: c.urutanAnak,
      bloodType: c.golonganDarah,
      gender: c.jenisKelamin,
      birthPlace: c.tempatLahir,
      birthDate: c.tanggalLahir,
      userId: c.penggunaId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      user: c.pengguna ? {
        id: c.pengguna.id,
        name: c.pengguna.nama,
        email: c.pengguna.email
      } : null
    }));

    res.json(mappedChildren);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllChildren;