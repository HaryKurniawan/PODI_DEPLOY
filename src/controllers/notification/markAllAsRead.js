const prisma = require('../../config/prisma');

// Mark all notifications as read for current user
const markAllAsRead = async (req, res) => {
    try {
        const penggunaId = req.user.id;

        await prisma.notifikasi.updateMany({
            where: { penggunaId, sudahDibaca: false },
            data: { sudahDibaca: true }
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error in markAllAsRead:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = markAllAsRead;
