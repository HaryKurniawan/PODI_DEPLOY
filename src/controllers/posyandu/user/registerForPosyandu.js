const prisma = require('../../../config/prisma');

const registerForPosyandu = async (req, res) => {
  try {
    const { scheduleId, childId } = req.body;
    const penggunaId = req.user.id;

    console.log('[Register Posyandu] Request:', { scheduleId, childId, penggunaId });

    if (!scheduleId || !childId) {
      return res.status(400).json({ message: 'Schedule ID and Child ID are required' });
    }

    const jadwal = await prisma.jadwalPosyandu.findUnique({
      where: { id: scheduleId }
    });

    if (!jadwal) {
      console.log('[Register Posyandu] Schedule not found:', scheduleId);
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const anak = await prisma.dataAnak.findUnique({
      where: { id: childId }
    });

    if (!anak) {
      console.log('[Register Posyandu] Child not found:', childId);
      const daftarAnak = await prisma.dataAnak.findMany({
        where: { penggunaId },
        select: { id: true, namaLengkap: true }
      });
      console.log('[Register Posyandu] User children:', daftarAnak);
      return res.status(404).json({ message: 'Child not found', childId, userChildren: daftarAnak.map(a => ({ id: a.id, fullName: a.namaLengkap })) });
    }

    if (anak.penggunaId !== penggunaId) {
      console.log('[Register Posyandu] Permission denied - child belongs to:', anak.penggunaId);
      return res.status(403).json({ message: 'You do not have permission to register this child' });
    }

    const existingRegistration = await prisma.pendaftaranPosyandu.findUnique({
      where: {
        jadwalId_anakId: {
          jadwalId: scheduleId,
          anakId: childId
        }
      }
    });

    if (existingRegistration && existingRegistration.status !== 'DIBATALKAN') {
      return res.status(400).json({
        message: 'This child is already registered for this schedule',
        currentStatus: existingRegistration.status
      });
    }

    if (existingRegistration && existingRegistration.status === 'DIBATALKAN') {
      const updatedRegistration = await prisma.pendaftaranPosyandu.update({
        where: { id: existingRegistration.id },
        data: {
          status: 'TERDAFTAR',
          terdaftarPada: new Date()
        },
        include: {
          anak: {
            select: { id: true, namaLengkap: true, nik: true, tanggalLahir: true }
          },
          jadwal: {
            select: { id: true, lokasi: true, tanggalJadwal: true, deskripsi: true }
          }
        }
      });

      // Map response to frontend format
      return res.json({
        message: 'Registration reactivated successfully',
        data: mapPendaftaranToResponse(updatedRegistration)
      });
    }

    const registration = await prisma.pendaftaranPosyandu.create({
      data: {
        jadwalId: scheduleId,
        anakId: childId,
        penggunaId,
        status: 'TERDAFTAR'
      },
      include: {
        anak: {
          select: { id: true, namaLengkap: true, nik: true, tanggalLahir: true }
        },
        jadwal: {
          select: { id: true, lokasi: true, tanggalJadwal: true, deskripsi: true }
        }
      }
    });

    res.json({
      message: 'Registration successful',
      data: mapPendaftaranToResponse(registration)
    });
  } catch (error) {
    console.error('Error in registerForPosyandu:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to map to frontend format
function mapPendaftaranToResponse(p) {
  return {
    id: p.id,
    scheduleId: p.jadwalId,
    childId: p.anakId,
    userId: p.penggunaId,
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
  };
}

module.exports = registerForPosyandu;
