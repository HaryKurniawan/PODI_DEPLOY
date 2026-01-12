const prisma = require('../../config/prisma');

// Update immunization record
const updateChildImmunization = async (req, res) => {
  try {
    const { immunizationId } = req.params;
    const {
      vaccinationDate,
      notes,
      administeredBy,
      status
    } = req.body;

    const immunization = await prisma.imunisasiAnak.findUnique({
      where: { id: immunizationId },
      include: {
        anak: true
      }
    });

    if (!immunization) {
      return res.status(404).json({ message: 'Catatan imunisasi tidak ditemukan' });
    }

    // Map status to Indonesian if needed
    let statusValue = status;
    if (status === 'COMPLETED') statusValue = 'SELESAI';
    if (status === 'PENDING') statusValue = 'MENUNGGU';
    if (status === 'CANCELLED') statusValue = 'DIBATALKAN';

    const updated = await prisma.imunisasiAnak.update({
      where: { id: immunizationId },
      data: {
        tanggalVaksinasi: vaccinationDate ? new Date(vaccinationDate) : undefined,
        catatan: notes !== undefined ? notes : undefined,
        diberikanOleh: administeredBy !== undefined ? administeredBy : undefined,
        status: statusValue || undefined
      },
      include: {
        vaksin: true,
        anak: {
          select: {
            namaLengkap: true,
            nik: true
          }
        }
      }
    });

    // Map to frontend format
    const mappedImmunization = {
      id: updated.id,
      vaccinationDate: updated.tanggalVaksinasi,
      notes: updated.catatan,
      administeredBy: updated.diberikanOleh,
      status: updated.status === 'SELESAI' ? 'COMPLETED' : updated.status,
      vaccine: updated.vaksin ? {
        id: updated.vaksin.id,
        name: updated.vaksin.nama,
        dose: updated.vaksin.dosis
      } : null,
      child: {
        fullName: updated.anak.namaLengkap,
        nik: updated.anak.nik
      }
    };

    res.json({
      message: 'Imunisasi berhasil diperbarui',
      data: mappedImmunization
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateChildImmunization;
