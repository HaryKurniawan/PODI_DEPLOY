const express = require('express');
const router = express.Router();

const { recordMotherKB, getMotherKBHistory } = require('../controllers/kbController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ============================================
// ADMIN ROUTES
// ============================================

// POST /kb/record - Record KB data for a mother
router.post('/record', protect, adminOnly, recordMotherKB);

// ============================================
// USER ROUTES
// ============================================

// GET /kb/my-history - Get logged-in user's KB history
router.get('/my-history', protect, getMotherKBHistory);

module.exports = router;
