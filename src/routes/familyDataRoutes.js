const express = require('express');
const router = express.Router();
const {
  checkProfileStatus,
  getFamilyData,
  saveMotherData,
  saveSpouseData,
  saveChildData,
  completeProfile
} = require('../controllers/familyDataController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile-status', protect, checkProfileStatus);
router.get('/family-data', protect, getFamilyData);
router.post('/mother-data', protect, saveMotherData);
router.post('/spouse-data', protect, saveSpouseData);
router.post('/child-data', protect, saveChildData);
router.post('/complete-profile', protect, completeProfile);

module.exports = router;