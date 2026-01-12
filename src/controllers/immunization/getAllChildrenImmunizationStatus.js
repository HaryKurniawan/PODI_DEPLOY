const prisma = require('../../config/prisma');

// Get all children immunization status (admin)
const getAllChildrenImmunizationStatus = async (req, res) => {
  try {
    const children = await prisma.dataAnak.findMany({
      include: {
        imunisasi: {
          where: { status: 'SELESAI' },
          include: { vaksin: true }
        },
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

    const childrenStatus = children.map(child => {
      const completedCount = child.imunisasi.length;

      return {
        id: child.id,
        fullName: child.namaLengkap,
        nik: child.nik,
        birthDate: child.tanggalLahir,
        parentName: child.pengguna.nama,
        completedImmunizations: completedCount,
        lastVaccination: child.imunisasi.length > 0
          ? new Date(Math.max(...child.imunisasi.map(i => new Date(i.tanggalVaksinasi))))
          : null
      };
    });

    res.json(childrenStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllChildrenImmunizationStatus;
