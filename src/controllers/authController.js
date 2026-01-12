const register = require('./auth/register');
const login = require('./auth/login');
const getProfile = require('./auth/getProfile');
const updateProfile = require('./auth/updateProfile');
const getAllUsers = require('./auth/getAllUsers');
const forgotPassword = require('./auth/forgotPassword');
const resetPassword = require('./auth/resetPassword');
const verifyEmail = require('./auth/verifyEmail');
const resendVerification = require('./auth/resendVerification');
const googleLogin = require('./auth/googleLogin');

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  googleLogin
};