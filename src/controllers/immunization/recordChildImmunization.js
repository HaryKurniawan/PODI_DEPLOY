const prisma = require('../../config/prisma');

// Add/Record immunization for child
const recordChildImmunization = async (req, res) => {
  try {
    const {
      childId,
      vaccineId,
      vaccinationDate,
      scheduleId,
      notes,
      administeredBy
    } = req.body;

    // Verify child exists
    const child = await prisma.dataAnak.findUnique({
      where: { id: childId }
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    // Verify vaccine exists
    const vaccine = await prisma.vaksinImunisasi.findUnique({
      where: { id: vaccineId }
    });

    if (!vaccine) {
      return res.status(404).json({ message: 'Vaksin tidak ditemukan' });
    }

    // Check if immunization already exists
    const existing = await prisma.imunisasiAnak.findFirst({
      where: {
        anakId: childId,
        vaksinId: vaccineId,
        tanggalVaksinasi: new Date(vaccinationDate)
      }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Catatan imunisasi sudah ada untuk tanggal ini'
      });
    }

    const immunization = await prisma.imunisasiAnak.create({
      data: {
        anakId: childId,
        vaksinId: vaccineId,
        tanggalVaksinasi: new Date(vaccinationDate),
        jadwalId: scheduleId || null,
        status: 'SELESAI',
        catatan: notes,
        diberikanOleh: administeredBy
      },
      include: {
        vaksin: true,
        anak: {
          select: {
            namaLengkap: true,
            nik: true,
            tanggalLahir: true
          }
        }
      }
    });

    // Map to frontend format
    const mappedImmunization = {
      id: immunization.id,
      childId: immunization.anakId,
      vaccineId: immunization.vaksinId,
      vaccinationDate: immunization.tanggalVaksinasi,
      status: immunization.status === 'SELESAI' ? 'COMPLETED' : immunization.status,
      notes: immunization.catatan,
      administeredBy: immunization.diberikanOleh,
      vaccine: immunization.vaksin ? {
        id: immunization.vaksin.id,
        name: immunization.vaksin.nama,
        dose: immunization.vaksin.dosis
      } : null,
      child: {
        fullName: immunization.anak.namaLengkap,
        nik: immunization.anak.nik,
        birthDate: immunization.anak.tanggalLahir
      }
    };

    res.json({
      message: 'Imunisasi berhasil dicatat',
      data: mappedImmunization
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = recordChildImmunization;
