const prisma = require('../../../config/prisma');
const { notifyNewSchedule } = require('../../notificationController');

const createSchedule = async (req, res) => {
  try {
    const { scheduleDate, location, description } = req.body;

    const jadwal = await prisma.jadwalPosyandu.create({
      data: {
        tanggalJadwal: new Date(scheduleDate),
        lokasi: location,
        deskripsi: description,
        aktif: true
      }
    });

    // Get all users to create notifications
    const daftarPengguna = await prisma.pengguna.findMany({
      where: { role: 'PENGGUNA' },
      select: { id: true }
    });

    // Create notification for each user in database
    if (daftarPengguna.length > 0) {
      const dateFormatted = new Date(scheduleDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      await prisma.notifikasi.createMany({
        data: daftarPengguna.map(pengguna => ({
          penggunaId: pengguna.id,
          judul: '📅 Jadwal Posyandu Baru',
          pesan: `Jadwal posyandu baru pada ${dateFormatted} di ${location}`,
          tipe: 'PENGINGAT',
          tipeResource: 'SCHEDULE',
          resourceId: jadwal.id
        }))
      });

      // Send push notification with mapped schedule
      await notifyNewSchedule({
        id: jadwal.id,
        scheduleDate: jadwal.tanggalJadwal,
        location: jadwal.lokasi,
        description: jadwal.deskripsi
      });
    }

    // Map response to frontend format
    res.json({
      message: 'Schedule created successfully',
      data: {
        id: jadwal.id,
        scheduleDate: jadwal.tanggalJadwal,
        location: jadwal.lokasi,
        description: jadwal.deskripsi,
        isActive: jadwal.aktif
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createSchedule;