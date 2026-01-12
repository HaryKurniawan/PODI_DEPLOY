const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    getCategories,
    getArticles,
    getArticleBySlug,
    saveArticle,
    unsaveArticle,
    getSavedArticles,
    checkSaved,
    adminGetCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    adminGetArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    uploadImage,
    getArticleBySlugAdmin,
    checkSlugAvailability
} = require('../controllers/educationController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ============================================
// PUBLIC ROUTES (untuk user)
// ============================================

router.get('/categories', getCategories);
router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);

// ============================================
// USER ROUTES (perlu login)
// ============================================

router.post('/articles/:articleId/save', protect, saveArticle);
router.delete('/articles/:articleId/save', protect, unsaveArticle);
router.get('/saved', protect, getSavedArticles);
router.get('/articles/:articleId/saved', protect, checkSaved);

// ============================================
// ADMIN ROUTES
// ============================================

// Categories
router.get('/admin/categories', protect, adminOnly, adminGetCategories);
router.post('/admin/categories', protect, adminOnly, createCategory);
router.put('/admin/categories/:id', protect, adminOnly, updateCategory);
router.delete('/admin/categories/:id', protect, adminOnly, deleteCategory);

// Articles
router.get('/admin/articles', protect, adminOnly, adminGetArticles);
router.get('/admin/articles/preview/:slug', protect, adminOnly, getArticleBySlugAdmin);
router.get('/admin/articles/check-slug/:slug', protect, adminOnly, checkSlugAvailability);
router.post('/admin/articles', protect, adminOnly, createArticle);
router.put('/admin/articles/:id', protect, adminOnly, updateArticle);
router.delete('/admin/articles/:id', protect, adminOnly, deleteArticle);

// Upload
router.post('/admin/upload', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;

