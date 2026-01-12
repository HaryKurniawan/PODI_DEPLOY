const prisma = require('../../config/prisma');
const { sendMulticastNotification } = require('../../config/firebase');

// Send announcement to all users (Admin only)
const sendAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        // Get all users (excluding admins)
        const daftarPengguna = await prisma.pengguna.findMany({
            where: { role: 'PENGGUNA' },
            select: { id: true }
        });

        if (daftarPengguna.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Create notification for each user
        const notifications = await prisma.notifikasi.createMany({
            data: daftarPengguna.map(pengguna => ({
                penggunaId: pengguna.id,
                judul: title,
                pesan: message,
                tipe: 'PENGUMUMAN',
                tipeResource: 'ANNOUNCEMENT',
                sudahDibaca: false
            }))
        });

        // Also send push notification via Firebase
        try {
            const tokens = await prisma.tokenFcm.findMany({
                where: {
                    penggunaId: { in: daftarPengguna.map(u => u.id) }
                },
                select: { token: true }
            });

            if (tokens.length > 0) {
                const tokenList = tokens.map(t => t.token);
                await sendMulticastNotification(
                    tokenList,
                    `📢 ${title}`,
                    message,
                    { type: 'ANNOUNCEMENT' }
                );
            }
        } catch (pushError) {
            console.error('Error sending push notification:', pushError);
        }

        res.json({
            message: 'Announcement sent successfully',
            recipientCount: daftarPengguna.length,
            notificationsCreated: notifications.count
        });
    } catch (error) {
        console.error('Error in sendAnnouncement:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = sendAnnouncement;
