const express = require('express');
const router = express.Router();
const {
  getAllChildren,
  getFamilyDataByChildId,
  getAllFamilies,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply middleware to all routes in this router
router.use(protect);
router.use(adminOnly);

// All routes require authentication and admin role
router.get('/dashboard-stats', getDashboardStats);
router.get('/children', getAllChildren);
router.get('/child/:childId/family-data', getFamilyDataByChildId);
router.get('/families', getAllFamilies);

module.exports = router;