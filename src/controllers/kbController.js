/**
 * KB (Keluarga Berencana) Controller
 * Exports all KB-related controllers
 */

const recordMotherKB = require('./kb/admin/recordMotherKB');
const getMotherKBHistory = require('./kb/user/getMotherKBHistory');

module.exports = {
    recordMotherKB,
    getMotherKBHistory
};
