const prisma = require('../../../config/prisma');

const getExaminationsBySchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const daftarPemeriksaan = await prisma.pemeriksaanAnak.findMany({
      where: { jadwalId: scheduleId },
      include: {
        anak: {
          include: {
            pengguna: {
              select: {
                nama: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map to frontend format
    const examinations = daftarPemeriksaan.map(p => ({
      id: p.id,
      childId: p.anakId,
      scheduleId: p.jadwalId,
      examinationDate: p.tanggalPemeriksaan,
      weight: p.beratBadan,
      height: p.tinggiBadan,
      headCircumference: p.lingkarKepala,
      armCircumference: p.lingkarLengan,
      immunization: p.imunisasi,
      notes: p.catatan,
      child: p.anak ? {
        id: p.anak.id,
        fullName: p.anak.namaLengkap,
        nik: p.anak.nik,
        user: p.anak.pengguna ? {
          name: p.anak.pengguna.nama,
          email: p.anak.pengguna.email
        } : null
      } : null
    }));

    res.json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getExaminationsBySchedule;