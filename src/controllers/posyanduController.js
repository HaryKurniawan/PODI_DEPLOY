// Admin endpoints
const createSchedule = require('./posyandu/admin/createSchedule');
const getAllSchedules = require('./posyandu/admin/getAllSchedules');
const getScheduleDetail = require('./posyandu/admin/getScheduleDetail');
const deleteSchedule = require('./posyandu/admin/deleteSchedule');
const searchChildByNIK = require('./posyandu/admin/searchChildByNIK');
const getAllChildren = require('./posyandu/admin/getAllChildren');
const createExamination = require('./posyandu/admin/createExamination');
const getExaminationsBySchedule = require('./posyandu/admin/getExaminationsBySchedule');
const getExaminationDetail = require('./posyandu/admin/getExaminationDetail');

// User endpoints
const getUpcomingSchedules = require('./posyandu/user/getUpcomingSchedules');
const registerForPosyandu = require('./posyandu/user/registerForPosyandu');
const cancelRegistration = require('./posyandu/user/cancelRegistration');
const getMyRegistrations = require('./posyandu/user/getMyRegistrations');
const getMyChildrenExaminations = require('./posyandu/user/getMyChildrenExaminations');
const getLatestExaminations = require('./posyandu/user/getLatestExaminations');

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleDetail,
  deleteSchedule,
  searchChildByNIK,
  getAllChildren,
  createExamination,
  getExaminationsBySchedule,
  getExaminationDetail,
  getUpcomingSchedules,
  registerForPosyandu,
  cancelRegistration,
  getMyRegistrations,
  getMyChildrenExaminations,
  getLatestExaminations
};