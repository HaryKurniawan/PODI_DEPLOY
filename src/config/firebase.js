// Firebase Admin SDK configuration
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
const initializeFirebase = () => {
    if (admin.apps.length === 0) {
        // Check if required env vars exist to prevent crash in serverless
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
            console.warn('⚠️ Skipping Firebase initialization: Missing environment variables');
            return null;
        }

        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
                })
            });
            console.log('✅ Firebase Admin initialized successfully');
        } catch (error) {
            console.error('❌ Firebase Admin initialization error:', error);
        }
    }
    return admin;
};

// Get Firebase Admin instance
const getFirebaseAdmin = () => {
    initializeFirebase();
    return admin;
};

// Send notification to a single device
const sendNotification = async (token, title, body, data = {}) => {
    const firebaseAdmin = getFirebaseAdmin();

    const message = {
        notification: {
            title,
            body
        },
        data: {
            ...data,
            timestamp: new Date().toISOString()
        },
        token
    };

    try {
        const response = await firebaseAdmin.messaging().send(message);
        console.log('✅ Notification sent:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('❌ Error sending notification:', error);
        return { success: false, error: error.message };
    }
};

// Send notification to multiple devices
const sendMulticastNotification = async (tokens, title, body, data = {}) => {
    if (!tokens || tokens.length === 0) {
        return { success: false, error: 'No tokens provided' };
    }

    const firebaseAdmin = getFirebaseAdmin();

    const message = {
        notification: {
            title,
            body
        },
        data: {
            ...data,
            timestamp: new Date().toISOString()
        },
        tokens
    };

    try {
        const response = await firebaseAdmin.messaging().sendEachForMulticast(message);
        console.log(`✅ Multicast sent: ${response.successCount} success, ${response.failureCount} failed`);
        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        console.error('❌ Error sending multicast:', error);
        return { success: false, error: error.message };
    }
};

// Send notification to topic
const sendTopicNotification = async (topic, title, body, data = {}) => {
    const firebaseAdmin = getFirebaseAdmin();

    const message = {
        notification: {
            title,
            body
        },
        data: {
            ...data,
            timestamp: new Date().toISOString()
        },
        topic
    };

    try {
        const response = await firebaseAdmin.messaging().send(message);
        console.log('✅ Topic notification sent:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('❌ Error sending topic notification:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    initializeFirebase,
    getFirebaseAdmin,
    sendNotification,
    sendMulticastNotification,
    sendTopicNotification
};
