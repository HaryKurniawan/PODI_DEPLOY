const prisma = require('../../config/prisma');
const admin = require('firebase-admin');
const generateToken = require('./utils/generateToken');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    const serviceAccount = require('../../../firebase.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

/**
 * Google Login - Only for registered users
 * Users cannot register via Google, only login if email already exists
 */
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'ID Token is required' });
        }

        // Verify the ID token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;

        if (!email) {
            return res.status(400).json({ message: 'Email not found in Google account' });
        }

        // Check if user exists in database
        const pengguna = await prisma.pengguna.findUnique({
            where: { email }
        });

        if (!pengguna) {
            return res.status(404).json({
                message: 'Email tidak terdaftar. Silakan daftar terlebih dahulu dengan email dan password.',
                notRegistered: true
            });
        }

        // Check if email is verified (auto-verify for Google login since Google already verified)
        if (!pengguna.emailTerverifikasi) {
            // Auto-verify email for Google login
            await prisma.pengguna.update({
                where: { id: pengguna.id },
                data: { emailTerverifikasi: true }
            });
        }

        // Generate JWT token and return user data
        res.json({
            id: pengguna.id,
            name: pengguna.nama,
            email: pengguna.email,
            role: pengguna.role,
            hasCompletedProfile: pengguna.sudahLengkapiProfil,
            token: generateToken(pengguna.id)
        });
    } catch (error) {
        console.error('Google Login Error:', error);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: 'Token expired. Please try again.' });
        }

        if (error.code === 'auth/invalid-id-token') {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = googleLogin;
