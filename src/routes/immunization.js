// URUTAN ROUTES SANGAT PENTING DI EXPRESS!
// Letakkan routes yang LEBIH SPESIFIK dulu (dengan path statis), 
// baru routes dengan parameter dinamis

const express = require('express');
const router = express.Router();
const {
  createImmunizationTemplate,
  getAllImmunizationTemplates,
  updateImmunizationTemplate,
  deleteImmunizationTemplate,
  getChildImmunizations,
  recordChildImmunization,
  updateChildImmunization,
  deleteChildImmunization,
  getChildImmunizationRoadmap,
  getAllChildrenImmunizationStatus
} = require('../controllers/immunizationController');
const { protect, admin } = require('../middleware/authMiddleware');


// IMMUNIZATION TEMPLATE ROUTES (ADMIN ONLY)

router.post('/immunization/template', protect, admin, createImmunizationTemplate);
router.get('/immunization/templates', protect, getAllImmunizationTemplates);
router.put('/immunization/template/:id', protect, admin, updateImmunizationTemplate);
router.delete('/immunization/template/:id', protect, admin, deleteImmunizationTemplate);

// CHILD IMMUNIZATION ROUTES

router.get('/immunization/status/all', protect, admin, getAllChildrenImmunizationStatus);
router.get('/child/:childId/immunizations', protect, getChildImmunizations);
router.get('/child/:childId/immunization-roadmap', protect, getChildImmunizationRoadmap);
router.post('/child/:childId/immunization', protect, admin, recordChildImmunization);
router.put('/immunization/:immunizationId', protect, admin, updateChildImmunization);
router.delete('/immunization/:immunizationId', protect, admin, deleteChildImmunization);

module.exports = router;