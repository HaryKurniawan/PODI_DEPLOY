const prisma = require('../../../config/prisma');

// Get all KPSP screenings (Admin)
const getAllScreenings = async (req, res) => {
  try {
    const { result, categoryId, startDate, endDate } = req.query;

    const where = {};

    if (result) {
      where.hasil = result;
    }

    if (categoryId) {
      where.kategoriId = categoryId;
    }

    if (startDate && endDate) {
      where.tanggalSkrining = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const screenings = await prisma.skriningKPSP.findMany({
      where,
      include: {
        anak: {
          select: {
            namaLengkap: true,
            tanggalLahir: true,
            nik: true,
            pengguna: {
              select: {
                nama: true,
                email: true
              }
            }
          }
        },
        kategori: {
          select: {
            nama: true,
            kode: true
          }
        }
      },
      orderBy: {
        tanggalSkrining: 'desc'
      }
    });

    // Map to frontend format
    const mappedScreenings = screenings.map(s => ({
      id: s.id,
      childId: s.anakId,
      categoryId: s.kategoriId,
      screeningDate: s.tanggalSkrining,
      ageAtScreening: s.usiaSaatSkrining,
      totalYes: s.totalYa,
      totalNo: s.totalTidak,
      result: s.hasil,
      notes: s.catatan,
      recommendedAction: s.rekomendasiTindakan,
      child: s.anak ? {
        fullName: s.anak.namaLengkap,
        birthDate: s.anak.tanggalLahir,
        nik: s.anak.nik,
        user: s.anak.pengguna ? {
          name: s.anak.pengguna.nama,
          email: s.anak.pengguna.email
        } : null
      } : null,
      category: s.kategori ? {
        name: s.kategori.nama,
        code: s.kategori.kode
      } : null
    }));

    res.json(mappedScreenings);
  } catch (error) {
    console.error('Error in getAllScreenings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllScreenings;