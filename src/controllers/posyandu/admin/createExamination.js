const prisma = require('../../../config/prisma');

// Create child examination WITH VACCINATION RECORDING
const createExamination = async (req, res) => {
  try {
    const {
      childId,
      scheduleId,
      weight,
      height,
      headCircumference,
      armCircumference,
      immunization,
      notes,
      vaccineIds // Array of vaccine IDs
    } = req.body;

    // Check if registration exists and update status to ATTENDED
    const pendaftaran = await prisma.pendaftaranPosyandu.findFirst({
      where: {
        anakId: childId,
        jadwalId: scheduleId,
        status: 'TERDAFTAR'
      }
    });

    if (pendaftaran) {
      await prisma.pendaftaranPosyandu.update({
        where: { id: pendaftaran.id },
        data: { status: 'HADIR' }
      });
    }

    // Get schedule for location info
    const jadwal = await prisma.jadwalPosyandu.findUnique({
      where: { id: scheduleId }
    });

    // Create examination record
    const pemeriksaan = await prisma.pemeriksaanAnak.create({
      data: {
        anakId: childId,
        jadwalId: scheduleId,
        tanggalPemeriksaan: new Date(),
        beratBadan: parseFloat(weight),
        tinggiBadan: parseFloat(height),
        lingkarKepala: parseFloat(headCircumference),
        lingkarLengan: parseFloat(armCircumference),
        imunisasi: immunization || '-',
        catatan: notes
      },
      include: {
        anak: true,
        jadwal: true
      }
    });

    // Record vaccinations if provided
    let recordedVaccines = [];
    if (vaccineIds && Array.isArray(vaccineIds) && vaccineIds.length > 0) {
      for (const vaccineId of vaccineIds) {
        try {
          // Check if vaccine already recorded today
          const existing = await prisma.imunisasiAnak.findFirst({
            where: {
              anakId: childId,
              vaksinId: vaccineId,
              tanggalVaksinasi: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999))
              }
            }
          });

          if (!existing) {
            const vaccineRecord = await prisma.imunisasiAnak.create({
              data: {
                anakId: childId,
                vaksinId: vaccineId,
                jadwalId: scheduleId,
                tanggalVaksinasi: new Date(),
                status: 'SELESAI',
                diberikanOleh: req.user?.name || 'Admin Posyandu',
                catatan: `Diberikan saat pemeriksaan di ${jadwal?.lokasi || '-'}`
              },
              include: {
                vaksin: true
              }
            });
            recordedVaccines.push(vaccineRecord);
          }
        } catch (vaccineError) {
          console.error(`Error recording vaccine ${vaccineId}:`, vaccineError);
        }
      }
    }

    // Map response to frontend format
    const response = {
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
        fullName: pemeriksaan.anak.namaLengkap
      } : null,
      schedule: pemeriksaan.jadwal ? {
        id: pemeriksaan.jadwal.id,
        location: pemeriksaan.jadwal.lokasi
      } : null
    };

    res.json({
      message: 'Examination saved successfully',
      data: {
        examination: response,
        recordedVaccines: recordedVaccines.map(v => ({
          id: v.id,
          vaccineId: v.vaksinId,
          vaccine: v.vaksin ? { name: v.vaksin.nama, dose: v.vaksin.dosis } : null
        })),
        vaccineCount: recordedVaccines.length
      }
    });
  } catch (error) {
    console.error('Error in createExamination:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createExamination;
