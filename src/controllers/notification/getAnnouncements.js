const prisma = require('../../config/prisma');

// Get all announcements sent (Admin only)
const getAnnouncements = async (req, res) => {
    try {
        // Get unique announcements by grouping
        const announcements = await prisma.notifikasi.findMany({
            where: { tipe: 'PENGUMUMAN' },
            orderBy: { createdAt: 'desc' },
            distinct: ['judul', 'pesan', 'createdAt'],
            take: 50
        });

        // Get unique announcements
        const uniqueAnnouncements = [];
        const seen = new Set();

        for (const ann of announcements) {
            const key = `${ann.judul}-${ann.createdAt.toISOString()}`;
            if (!seen.has(key)) {
                seen.add(key);
                // Count recipients
                const count = await prisma.notifikasi.count({
                    where: {
                        tipe: 'PENGUMUMAN',
                        judul: ann.judul,
                        createdAt: ann.createdAt
                    }
                });
                uniqueAnnouncements.push({
                    id: ann.id,
                    title: ann.judul,
                    message: ann.pesan,
                    createdAt: ann.createdAt,
                    recipientCount: count
                });
            }
        }

        res.json(uniqueAnnouncements);
    } catch (error) {
        console.error('Error in getAnnouncements:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getAnnouncements;
