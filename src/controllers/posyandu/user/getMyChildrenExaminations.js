const prisma = require('../../../config/prisma');

// Get examination history with vaccines
const getMyChildrenExaminations = async (req, res) => {
  try {
    const daftarPemeriksaan = await prisma.pemeriksaanAnak.findMany({
      where: {
        anak: {
          penggunaId: req.user.id
        }
      },
      include: {
        anak: {
          select: {
            id: true,
            namaLengkap: true,
            nik: true,
            tanggalLahir: true
          }
        },
        jadwal: {
          select: {
            lokasi: true,
            tanggalJadwal: true
          }
        }
      },
      orderBy: {
        tanggalPemeriksaan: 'desc'
      }
    });

    // Get vaccines for each examination
    const examinationsWithVaccines = await Promise.all(
      daftarPemeriksaan.map(async (exam) => {
        const vaccines = await prisma.imunisasiAnak.findMany({
          where: {
            anakId: exam.anakId,
            jadwalId: exam.jadwalId,
            tanggalVaksinasi: {
              gte: new Date(new Date(exam.tanggalPemeriksaan).setHours(0, 0, 0, 0)),
              lt: new Date(new Date(exam.tanggalPemeriksaan).setHours(23, 59, 59, 999))
            }
          },
          include: {
            vaksin: true
          }
        });

        // Map to frontend format
        return {
          id: exam.id,
          childId: exam.anakId,
          scheduleId: exam.jadwalId,
          examinationDate: exam.tanggalPemeriksaan,
          weight: exam.beratBadan,
          height: exam.tinggiBadan,
          headCircumference: exam.lingkarKepala,
          armCircumference: exam.lingkarLengan,
          immunization: exam.imunisasi,
          notes: exam.catatan,
          child: {
            id: exam.anak.id,
            fullName: exam.anak.namaLengkap,
            nik: exam.anak.nik,
            birthDate: exam.anak.tanggalLahir
          },
          schedule: {
            location: exam.jadwal.lokasi,
            scheduleDate: exam.jadwal.tanggalJadwal
          },
          vaccinesGiven: vaccines.map(v => ({
            id: v.id,
            vaccineId: v.vaksinId,
            vaccinationDate: v.tanggalVaksinasi,
            status: v.status,
            vaccine: v.vaksin ? {
              id: v.vaksin.id,
              name: v.vaksin.nama,
              dose: v.vaksin.dosis
            } : null
          }))
        };
      })
    );

    res.json(examinationsWithVaccines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getMyChildrenExaminations;
