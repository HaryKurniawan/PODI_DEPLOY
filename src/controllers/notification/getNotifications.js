const prisma = require('../../config/prisma');

// Get all notifications for current user
const getNotifications = async (req, res) => {
    try {
        const penggunaId = req.user.id;

        const daftarNotifikasi = await prisma.notifikasi.findMany({
            where: { penggunaId },
            orderBy: { createdAt: 'desc' }
        });

        // Map to frontend format
        const notifications = daftarNotifikasi.map(n => ({
            id: n.id,
            userId: n.penggunaId,
            title: n.judul,
            message: n.pesan,
            type: n.tipe === 'PENGUMUMAN' ? 'ANNOUNCEMENT' : n.tipe === 'PENGINGAT' ? 'REMINDER' : n.tipe === 'KESEHATAN' ? 'HEALTH' : 'INFO',
            isRead: n.sudahDibaca,
            resourceType: n.tipeResource,
            resourceId: n.resourceId,
            createdAt: n.createdAt
        }));

        res.json(notifications);
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getNotifications;
