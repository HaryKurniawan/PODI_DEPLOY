// User endpoints
const getUserChildren = require('./kpsp/user/getUserChildren');
const getKPSPCategories = require('./kpsp/user/getKPSPCategories');
const getKPSPCategoryByCode = require('./kpsp/user/getKPSPCategoryByCode');
const submitKPSPScreening = require('./kpsp/user/submitKPSPScreening');
const getChildScreeningHistory = require('./kpsp/user/getChildScreeningHistory');
const getScreeningDetail = require('./kpsp/user/getScreeningDetail');

// Admin endpoints
const getAllScreenings = require('./kpsp/admin/getAllScreenings');
const getKPSPStatistics = require('./kpsp/admin/getKPSPStatistics');
const createKPSPCategory = require('./kpsp/admin/createKPSPCategory');
const createKPSPQuestion = require('./kpsp/admin/createKPSPQuestion');
const updateKPSPCategory = require('./kpsp/admin/updateKPSPCategory');
const deleteKPSPCategory = require('./kpsp/admin/deleteKPSPCategory');
const updateKPSPQuestion = require('./kpsp/admin/updateKPSPQuestion');
const deleteKPSPQuestion = require('./kpsp/admin/deleteKPSPQuestion');
const getScreeningDetailAdmin = require('./kpsp/admin/getScreeningDetailAdmin');

// Development Area endpoints
const getDevelopmentAreas = require('./kpsp/admin/getDevelopmentAreas');
const createDevelopmentArea = require('./kpsp/admin/createDevelopmentArea');
const updateDevelopmentArea = require('./kpsp/admin/updateDevelopmentArea');
const deleteDevelopmentArea = require('./kpsp/admin/deleteDevelopmentArea');

module.exports = {
  // User endpoints
  getUserChildren,
  getKPSPCategories,
  getKPSPCategoryByCode,
  submitKPSPScreening,
  getChildScreeningHistory,
  getScreeningDetail,
  // Admin endpoints
  getAllScreenings,
  getKPSPStatistics,
  createKPSPCategory,
  createKPSPQuestion,
  updateKPSPCategory,
  deleteKPSPCategory,
  updateKPSPQuestion,
  deleteKPSPQuestion,
  getScreeningDetailAdmin,
  // Development Area endpoints
  getDevelopmentAreas,
  createDevelopmentArea,
  updateDevelopmentArea,
  deleteDevelopmentArea
};