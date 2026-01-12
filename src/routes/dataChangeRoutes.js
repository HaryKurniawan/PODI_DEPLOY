/**
 * Data Change Routes
 * Routes for data change requests with admin approval
 */

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    submitChangeRequest,
    getMyChangeRequests,
    getPendingRequests,
    getAllRequests,
    approveRequest,
    rejectRequest
} = require('../controllers/dataChangeController');

// User routes
router.post('/', protect, submitChangeRequest);
router.get('/my-requests', protect, getMyChangeRequests);

// Admin routes
router.get('/pending', protect, adminOnly, getPendingRequests);
router.get('/all', protect, adminOnly, getAllRequests);
router.put('/:id/approve', protect, adminOnly, approveRequest);
router.put('/:id/reject', protect, adminOnly, rejectRequest);

module.exports = router;
