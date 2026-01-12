const prisma = require('../../../config/prisma');

const getAllSchedules = async (req, res) => {
  try {
    const daftarJadwal = await prisma.jadwalPosyandu.findMany({
      orderBy: {
        tanggalJadwal: 'desc'
      },
      include: {
        _count: {
          select: {
            pemeriksaan: true,
            pendaftaran: true
          }
        },
        pendaftaran: {
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
          }
        },
        pemeriksaan: {
          include: {
            anak: true
          }
        }
      }
    });

    // Map to frontend format
    const schedules = daftarJadwal.map(j => ({
      id: j.id,
      scheduleDate: j.tanggalJadwal,
      location: j.lokasi,
      description: j.deskripsi,
      isActive: j.aktif,
      _count: {
        examinations: j._count.pemeriksaan,
        registrations: j._count.pendaftaran
      },
      registrations: j.pendaftaran.map(p => ({
        id: p.id,
        status: p.status === 'TERDAFTAR' ? 'REGISTERED' : p.status === 'HADIR' ? 'ATTENDED' : 'CANCELLED',
        child: p.anak ? {
          id: p.anak.id,
          fullName: p.anak.namaLengkap,
          nik: p.anak.nik,
          user: p.anak.pengguna ? {
            name: p.anak.pengguna.nama,
            email: p.anak.pengguna.email
          } : null
        } : null
      })),
      examinations: j.pemeriksaan.map(e => ({
        id: e.id,
        examinationDate: e.tanggalPemeriksaan,
        child: e.anak ? {
          id: e.anak.id,
          fullName: e.anak.namaLengkap
        } : null
      }))
    }));

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllSchedules;