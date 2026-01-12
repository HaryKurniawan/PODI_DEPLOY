const checkProfileStatus = require('./family/checkProfileStatus');
const getFamilyData = require('./family/getFamilyData');
const saveMotherData = require('./family/saveMotherData');
const saveSpouseData = require('./family/saveSpouseData');
const saveChildData = require('./family/saveChildData');
const completeProfile = require('./family/completeProfile');

module.exports = {
  checkProfileStatus,
  getFamilyData,
  saveMotherData,
  saveSpouseData,
  saveChildData,
  completeProfile
};