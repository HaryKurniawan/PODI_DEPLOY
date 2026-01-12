const prisma = require('../../config/prisma');

// Delete a notification
const deleteNotification = async (req, res) => {
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

        await prisma.notifikasi.delete({
            where: { id }
        });

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error in deleteNotification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteNotification;
