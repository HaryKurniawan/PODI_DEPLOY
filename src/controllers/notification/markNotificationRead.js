const prisma = require('../../config/prisma');

// Mark single notification as read
const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const penggunaId = req.user.id;

        // Verify ownership
        const notifikasi = await prisma.notifikasi.findFirst({
            where: { id, penggunaId }
        });

        if (!notifikasi) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        const updated = await prisma.notifikasi.update({
            where: { id },
            data: { sudahDibaca: true }
        });

        // Map to frontend format
        res.json({
            id: updated.id,
            isRead: updated.sudahDibaca
        });
    } catch (error) {
        console.error('Error in markNotificationRead:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = markNotificationRead;
