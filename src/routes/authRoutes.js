const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    getAllUsers,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    googleLogin
} = require('../controllers/authController');
const changePassword = require('../controllers/auth/changePassword');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);

// Email verification & password reset (public)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;