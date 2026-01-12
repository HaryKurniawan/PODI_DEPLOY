// Notification controller
const prisma = require('../config/prisma');
const { sendNotification, sendMulticastNotification } = require('../config/firebase');

// Save FCM token for user
const saveFcmToken = async (req, res) => {
    try {
        const { token, device } = req.body;
        const penggunaId = req.user.id;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Check if token already exists
        const existingToken = await prisma.tokenFcm.findUnique({
            where: { token }
        });

        if (existingToken) {
            // Update existing token
            await prisma.tokenFcm.update({
                where: { token },
                data: {
                    penggunaId,
                    device: device || 'web',
                    updatedAt: new Date()
                }
            });
        } else {
            // Create new token
            await prisma.tokenFcm.create({
                data: {
                    token,
                    penggunaId,
                    device: device || 'web'
                }
            });
        }

        res.json({ message: 'Token saved successfully' });
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ error: 'Failed to save token' });
    }
};

// Delete FCM token
const deleteFcmToken = async (req, res) => {
    try {
        const { token } = req.body;

        await prisma.tokenFcm.deleteMany({
            where: { token }
        });

        res.json({ message: 'Token deleted successfully' });
    } catch (error) {
        console.error('Error deleting FCM token:', error);
        res.status(500).json({ error: 'Failed to delete token' });
    }
};

// Send notification to specific user
const sendToUser = async (req, res) => {
    try {
        const { userId, title, body, data } = req.body;

        if (!userId || !title || !body) {
            return res.status(400).json({ error: 'userId, title, and body are required' });
        }

        // Get user's FCM tokens
        const tokens = await prisma.tokenFcm.findMany({
            where: { penggunaId: userId },
            select: { token: true }
        });

        if (tokens.length === 0) {
            return res.status(404).json({ error: 'No tokens found for user' });
        }

        const tokenList = tokens.map(t => t.token);
        const result = await sendMulticastNotification(tokenList, title, body, data || {});

        res.json(result);
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
};

// Send notification to all users
const sendToAll = async (req, res) => {
    try {
        const { title, body, data } = req.body;

        if (!title || !body) {
            return res.status(400).json({ error: 'title and body are required' });
        }

        // Get all FCM tokens
        const tokens = await prisma.tokenFcm.findMany({
            select: { token: true }
        });

        if (tokens.length === 0) {
            return res.status(404).json({ error: 'No tokens found' });
        }

        const tokenList = tokens.map(t => t.token);
        const result = await sendMulticastNotification(tokenList, title, body, data || {});

        res.json(result);
    } catch (error) {
        console.error('Error sending notification to all:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
};

// Helper: Send notification to user by ID (internal use)
const notifyUser = async (penggunaId, title, body, data = {}) => {
    try {
        const tokens = await prisma.tokenFcm.findMany({
            where: { penggunaId },
            select: { token: true }
        });

        if (tokens.length === 0) {
            return { success: false, error: 'No tokens found' };
        }

        const tokenList = tokens.map(t => t.token);
        return await sendMulticastNotification(tokenList, title, body, data);
    } catch (error) {
        console.error('Error in notifyUser:', error);
        return { success: false, error: error.message };
    }
};

// Helper: Send notification about new schedule
const notifyNewSchedule = async (schedule) => {
    try {
        const tokens = await prisma.tokenFcm.findMany({
            select: { token: true }
        });

        if (tokens.length === 0) return;

        const tokenList = tokens.map(t => t.token);
        const date = new Date(schedule.scheduleDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        await sendMulticastNotification(
            tokenList,
            '📅 Jadwal Posyandu Baru',
            `Jadwal posyandu baru: Posyandu pada ${date} di ${schedule.location}`,
            {
                type: 'NEW_SCHEDULE',
                scheduleId: schedule.id,
                url: '/jadwal'
            }
        );
    } catch (error) {
        console.error('Error notifying new schedule:', error);
    }
};

// Helper: Send reminder 1 hour before schedule
const sendScheduleReminder = async (registration) => {
    try {
        const penggunaId = registration.penggunaId || registration.userId;
        const schedule = registration.jadwal || registration.schedule;
        const child = registration.anak || registration.child;

        const time = new Date(schedule.tanggalJadwal || schedule.scheduleDate).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });

        await notifyUser(
            penggunaId,
            '⏰ Pengingat Posyandu',
            `Jadwal posyandu untuk ${child.namaLengkap || child.fullName} akan dimulai 1 jam lagi pukul ${time} di ${schedule.lokasi || schedule.location}`,
            {
                type: 'SCHEDULE_REMINDER',
                scheduleId: schedule.id,
                childId: child.id,
                url: '/jadwal'
            }
        );
    } catch (error) {
        console.error('Error sending schedule reminder:', error);
    }
};

module.exports = {
    saveFcmToken,
    deleteFcmToken,
    sendToUser,
    sendToAll,
    notifyUser,
    notifyNewSchedule,
    sendScheduleReminder
};
