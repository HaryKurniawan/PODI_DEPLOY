const prisma = require('../../../config/prisma');

const getUpcomingSchedules = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daftarJadwal = await prisma.jadwalPosyandu.findMany({
      where: {
        tanggalJadwal: {
          gte: today
        },
        aktif: true
      },
      orderBy: {
        tanggalJadwal: 'asc'
      },
      include: {
        _count: {
          select: {
            pendaftaran: {
              where: {
                status: {
                  not: 'DIBATALKAN'
                }
              }
            }
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
        registrations: j._count.pendaftaran
      }
    }));

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getUpcomingSchedules;