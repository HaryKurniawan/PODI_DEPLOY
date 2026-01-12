// User endpoints
const getCategories = require('./education/user/getCategories');
const getArticles = require('./education/user/getArticles');
const getArticleBySlug = require('./education/user/getArticleBySlug');
const saveArticle = require('./education/user/saveArticle');
const unsaveArticle = require('./education/user/unsaveArticle');
const getSavedArticles = require('./education/user/getSavedArticles');
const checkSaved = require('./education/user/checkSaved');

// Admin endpoints
const adminGetCategories = require('./education/admin/getCategories');
const createCategory = require('./education/admin/createCategory');
const updateCategory = require('./education/admin/updateCategory');
const deleteCategory = require('./education/admin/deleteCategory');
const adminGetArticles = require('./education/admin/getArticles');
const createArticle = require('./education/admin/createArticle');
const updateArticle = require('./education/admin/updateArticle');
const deleteArticle = require('./education/admin/deleteArticle');
const uploadImage = require('./education/admin/uploadImage');
const getArticleBySlugAdmin = require('./education/admin/getArticleBySlugAdmin');
const checkSlugAvailability = require('./education/admin/checkSlugAvailability');

module.exports = {
    // User endpoints
    getCategories,
    getArticles,
    getArticleBySlug,
    saveArticle,
    unsaveArticle,
    getSavedArticles,
    checkSaved,
    // Admin endpoints
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
};

