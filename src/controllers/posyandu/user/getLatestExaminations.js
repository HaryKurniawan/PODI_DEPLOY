const prisma = require('../../../config/prisma');

const getLatestExaminations = async (req, res) => {
  try {
    const daftarAnak = await prisma.dataAnak.findMany({
      where: { penggunaId: req.user.id },
      include: {
        pemeriksaan: {
          orderBy: {
            tanggalPemeriksaan: 'desc'
          },
          take: 1,
          include: {
            jadwal: true
          }
        }
      }
    });

    // Map to frontend format
    const children = daftarAnak.map(anak => ({
      id: anak.id,
      fullName: anak.namaLengkap,
      nik: anak.nik,
      birthDate: anak.tanggalLahir,
      examinations: anak.pemeriksaan.map(p => ({
        id: p.id,
        examinationDate: p.tanggalPemeriksaan,
        weight: p.beratBadan,
        height: p.tinggiBadan,
        headCircumference: p.lingkarKepala,
        armCircumference: p.lingkarLengan,
        schedule: p.jadwal ? {
          id: p.jadwal.id,
          location: p.jadwal.lokasi,
          scheduleDate: p.jadwal.tanggalJadwal
        } : null
      }))
    }));

    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getLatestExaminations;
