const prisma = require('../../config/prisma');

// Get child immunization records
const getChildImmunizations = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const child = await prisma.dataAnak.findUnique({
      where: { id: childId },
      include: {
        pengguna: {
          select: { id: true }
        }
      }
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    // Allow if user is the parent or admin
    if (child.pengguna.id !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Tidak memiliki akses' });
    }

    const immunizations = await prisma.imunisasiAnak.findMany({
      where: { anakId: childId },
      include: {
        vaksin: true,
        jadwal: {
          select: {
            id: true,
            tanggalJadwal: true,
            lokasi: true
          }
        }
      },
      orderBy: {
        tanggalVaksinasi: 'desc'
      }
    });

    // Map to frontend format
    const mappedImmunizations = immunizations.map(imm => ({
      id: imm.id,
      childId: imm.anakId,
      vaccineId: imm.vaksinId,
      vaccinationDate: imm.tanggalVaksinasi,
      status: imm.status,
      notes: imm.catatan,
      administeredBy: imm.diberikanOleh,
      vaccine: imm.vaksin ? {
        id: imm.vaksin.id,
        name: imm.vaksin.nama,
        dose: imm.vaksin.dosis,
        description: imm.vaksin.deskripsi,
        recommendedAge: imm.vaksin.usiaRekomendasi
      } : null,
      schedule: imm.jadwal ? {
        id: imm.jadwal.id,
        scheduleDate: imm.jadwal.tanggalJadwal,
        location: imm.jadwal.lokasi
      } : null
    }));

    res.json(mappedImmunizations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getChildImmunizations;
