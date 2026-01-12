/**
 * Growth Routes
 * API routes untuk fitur Tumbuh Kembang Anak
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getChildGrowthAnalysis,
    getGrowthHistory,
    getMyChildrenGrowthStatus,
    updateChildGender
} = require('../controllers/growth/growthController');

// Semua route butuh authentication
router.use(protect);

// Get growth status semua anak user
router.get('/my-children', getMyChildrenGrowthStatus);

// Get growth analysis untuk satu anak
router.get('/child/:childId', getChildGrowthAnalysis);

// Get growth history untuk grafik
router.get('/history/:childId', getGrowthHistory);

// Update gender anak
router.put('/child/:childId/gender', updateChildGender);

module.exports = router;
