// Notification routes
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Existing notification controller
const {
    saveFcmToken,
    deleteFcmToken,
    sendToUser,
    sendToAll
} = require('../controllers/notificationController');

// New notification controllers
const getNotifications = require('../controllers/notification/getNotifications');
const markNotificationRead = require('../controllers/notification/markNotificationRead');
const markAllAsRead = require('../controllers/notification/markAllAsRead');
const deleteNotification = require('../controllers/notification/deleteNotification');
const sendAnnouncement = require('../controllers/notification/sendAnnouncement');
const getAnnouncements = require('../controllers/notification/getAnnouncements');

// User routes - FCM token management
router.post('/token', protect, saveFcmToken);
router.delete('/token', protect, deleteFcmToken);

// User routes - Notification management
router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markNotificationRead);
router.patch('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

// Admin routes - Send push notifications (existing)
router.post('/send/user', protect, adminOnly, sendToUser);
router.post('/send/all', protect, adminOnly, sendToAll);

// Admin routes - Announcement management (new)
router.post('/announcement', protect, adminOnly, sendAnnouncement);
router.get('/announcements', protect, adminOnly, getAnnouncements);

// Cron routes - Triggered by Vercel Cron (Protected by CRON_SECRET)
const { checkUpcomingSchedules, checkUpcomingImmunizations } = require('../utils/notificationScheduler');

router.get('/cron/schedules', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await checkUpcomingSchedules();
        res.json({ success: true, message: 'Schedule checks completed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/cron/immunizations', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await checkUpcomingImmunizations();
        res.json({ success: true, message: 'Immunization checks completed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

