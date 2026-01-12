const prisma = require('../../../config/prisma');

const getMyRegistrations = async (req, res) => {
  try {
    const penggunaId = req.user.id;

    const daftarPendaftaran = await prisma.pendaftaranPosyandu.findMany({
      where: {
        penggunaId: penggunaId
      },
      include: {
        anak: true,
        jadwal: true
      },
      orderBy: {
        terdaftarPada: 'desc'
      }
    });

    // Map to frontend format
    const registrations = daftarPendaftaran.map(p => ({
      id: p.id,
      scheduleId: p.jadwalId,
      childId: p.anakId,
      status: p.status === 'TERDAFTAR' ? 'REGISTERED' : p.status === 'HADIR' ? 'ATTENDED' : 'CANCELLED',
      registeredAt: p.terdaftarPada,
      child: p.anak ? {
        id: p.anak.id,
        fullName: p.anak.namaLengkap,
        nik: p.anak.nik,
        birthDate: p.anak.tanggalLahir
      } : null,
      schedule: p.jadwal ? {
        id: p.jadwal.id,
        location: p.jadwal.lokasi,
        scheduleDate: p.jadwal.tanggalJadwal,
        description: p.jadwal.deskripsi
      } : null
    }));

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getMyRegistrations;
