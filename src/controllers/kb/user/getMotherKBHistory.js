const prisma = require('../../../config/prisma');

/**
 * Get mother's KB history for the logged-in user
 * GET /kb/my-history
 */
const getMotherKBHistory = async (req, res) => {
    try {
        const penggunaId = req.user.id;

        const daftarCatatanKB = await prisma.catatanKBIbu.findMany({
            where: { penggunaId },
            include: {
                jadwal: {
                    select: {
                        id: true,
                        tanggalJadwal: true,
                        lokasi: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map to frontend format
        const kbRecords = daftarCatatanKB.map(kb => ({
            id: kb.id,
            userId: kb.penggunaId,
            scheduleId: kb.jadwalId,
            method: kb.metode,
            startDate: kb.tanggalMulai,
            status: kb.status === 'AKTIF' ? 'ACTIVE' : 'INACTIVE',
            notes: kb.catatan,
            recordedBy: kb.dicatatOleh,
            createdAt: kb.createdAt,
            schedule: kb.jadwal ? {
                id: kb.jadwal.id,
                scheduleDate: kb.jadwal.tanggalJadwal,
                location: kb.jadwal.lokasi
            } : null
        }));

        res.json(kbRecords);

    } catch (error) {
        console.error('Error fetching KB history:', error);
        res.status(500).json({
            message: 'Gagal mengambil riwayat KB',
            error: error.message
        });
    }
};

module.exports = getMotherKBHistory;
