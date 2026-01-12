const prisma = require('../../../config/prisma');

const getScheduleDetail = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const jadwal = await prisma.jadwalPosyandu.findUnique({
      where: { id: scheduleId },
      include: {
        pendaftaran: {
          include: {
            anak: {
              include: {
                pengguna: {
                  include: {
                    dataIbu: true,
                    dataSuami: true
                  }
                }
              }
            }
          },
          orderBy: {
            terdaftarPada: 'desc'
          }
        },
        pemeriksaan: {
          include: {
            anak: true
          },
          orderBy: {
            tanggalPemeriksaan: 'desc'
          }
        },
        _count: {
          select: {
            pendaftaran: true,
            pemeriksaan: true
          }
        }
      }
    });

    if (!jadwal) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Map to frontend format
    const response = {
      id: jadwal.id,
      scheduleDate: jadwal.tanggalJadwal,
      location: jadwal.lokasi,
      description: jadwal.deskripsi,
      isActive: jadwal.aktif,
      _count: {
        registrations: jadwal._count.pendaftaran,
        examinations: jadwal._count.pemeriksaan
      },
      registrations: jadwal.pendaftaran.map(p => ({
        id: p.id,
        status: p.status === 'TERDAFTAR' ? 'REGISTERED' : p.status === 'HADIR' ? 'ATTENDED' : 'CANCELLED',
        registeredAt: p.terdaftarPada,
        child: p.anak ? {
          id: p.anak.id,
          fullName: p.anak.namaLengkap,
          nik: p.anak.nik,
          birthDate: p.anak.tanggalLahir,
          user: p.anak.pengguna ? {
            id: p.anak.pengguna.id,
            name: p.anak.pengguna.nama,
            motherData: p.anak.pengguna.dataIbu ? {
              fullName: p.anak.pengguna.dataIbu.namaLengkap,
              phoneNumber: p.anak.pengguna.dataIbu.noTelepon
            } : null,
            spouseData: p.anak.pengguna.dataSuami ? {
              fullName: p.anak.pengguna.dataSuami.namaLengkap
            } : null
          } : null
        } : null
      })),
      examinations: jadwal.pemeriksaan.map(e => ({
        id: e.id,
        examinationDate: e.tanggalPemeriksaan,
        weight: e.beratBadan,
        height: e.tinggiBadan,
        headCircumference: e.lingkarKepala,
        armCircumference: e.lingkarLengan,
        immunization: e.imunisasi,
        notes: e.catatan,
        child: e.anak ? {
          id: e.anak.id,
          fullName: e.anak.namaLengkap,
          nik: e.anak.nik
        } : null
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getScheduleDetail;