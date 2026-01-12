const prisma = require('../../../config/prisma');

// Get examination detail with vaccines
const getExaminationDetail = async (req, res) => {
  try {
    const { examinationId } = req.params;

    const pemeriksaan = await prisma.pemeriksaanAnak.findUnique({
      where: { id: examinationId },
      include: {
        anak: {
          include: {
            pengguna: {
              include: {
                dataIbu: true
              }
            }
          }
        },
        jadwal: true
      }
    });

    if (!pemeriksaan) {
      return res.status(404).json({ message: 'Examination not found' });
    }

    // Get vaccines given during this examination
    const vaccines = await prisma.imunisasiAnak.findMany({
      where: {
        anakId: pemeriksaan.anakId,
        jadwalId: pemeriksaan.jadwalId,
        tanggalVaksinasi: {
          gte: new Date(new Date(pemeriksaan.tanggalPemeriksaan).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(pemeriksaan.tanggalPemeriksaan).setHours(23, 59, 59, 999))
        }
      },
      include: {
        vaksin: true
      }
    });

    // Map to frontend format
    res.json({
      id: pemeriksaan.id,
      childId: pemeriksaan.anakId,
      scheduleId: pemeriksaan.jadwalId,
      examinationDate: pemeriksaan.tanggalPemeriksaan,
      weight: pemeriksaan.beratBadan,
      height: pemeriksaan.tinggiBadan,
      headCircumference: pemeriksaan.lingkarKepala,
      armCircumference: pemeriksaan.lingkarLengan,
      immunization: pemeriksaan.imunisasi,
      notes: pemeriksaan.catatan,
      child: pemeriksaan.anak ? {
        id: pemeriksaan.anak.id,
        fullName: pemeriksaan.anak.namaLengkap,
        nik: pemeriksaan.anak.nik,
        user: pemeriksaan.anak.pengguna ? {
          id: pemeriksaan.anak.pengguna.id,
          name: pemeriksaan.anak.pengguna.nama,
          motherData: pemeriksaan.anak.pengguna.dataIbu ? {
            fullName: pemeriksaan.anak.pengguna.dataIbu.namaLengkap,
            phoneNumber: pemeriksaan.anak.pengguna.dataIbu.noTelepon
          } : null
        } : null
      } : null,
      schedule: pemeriksaan.jadwal ? {
        id: pemeriksaan.jadwal.id,
        location: pemeriksaan.jadwal.lokasi,
        scheduleDate: pemeriksaan.jadwal.tanggalJadwal
      } : null,
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
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getExaminationDetail;
