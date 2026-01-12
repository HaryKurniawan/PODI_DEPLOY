const createImmunizationTemplate = require('./immunization/createImmunizationTemplate');
const getAllImmunizationTemplates = require('./immunization/getAllImmunizationTemplates');
const updateImmunizationTemplate = require('./immunization/updateImmunizationTemplate');
const deleteImmunizationTemplate = require('./immunization/deleteImmunizationTemplate');
const getChildImmunizations = require('./immunization/getChildImmunizations');
const recordChildImmunization = require('./immunization/recordChildImmunization');
const updateChildImmunization = require('./immunization/updateChildImmunization');
const deleteChildImmunization = require('./immunization/deleteChildImmunization');
const getChildImmunizationRoadmap = require('./immunization/getChildImmunizationRoadmap');
const getAllChildrenImmunizationStatus = require('./immunization/getAllChildrenImmunizationStatus');

module.exports = {
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
};