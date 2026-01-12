const prisma = require('../../../config/prisma');

const deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;

        // Verify schedule exists
        const jadwal = await prisma.jadwalPosyandu.findUnique({
            where: { id: scheduleId },
            include: {
                _count: {
                    select: {
                        pemeriksaan: true,
                        pendaftaran: true
                    }
                }
            }
        });

        if (!jadwal) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
        }

        // Prevent deletion if there are examinations
        if (jadwal._count.pemeriksaan > 0) {
            return res.status(400).json({
                message: `Jadwal tidak dapat dihapus karena sudah memiliki ${jadwal._count.pemeriksaan} data pemeriksaan. Hapus data pemeriksaan terlebih dahulu.`
            });
        }

        // Delete schedule (registrations and immunizations will cascade delete)
        await prisma.jadwalPosyandu.delete({
            where: { id: scheduleId }
        });

        res.json({
            message: 'Jadwal berhasil dihapus',
            deletedRegistrations: jadwal._count.pendaftaran
        });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteSchedule;
