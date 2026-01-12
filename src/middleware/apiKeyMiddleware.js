const crypto = require('crypto');

// Function untuk generate API key (jalankan sekali untuk buat key baru)
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Middleware untuk validasi API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false,
      message: 'API key is required. Please provide x-api-key in headers.' 
    });
  }
  
  // Validasi dengan API key dari environment variable
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ 
      success: false,
      message: 'Invalid API key.' 
    });
  }
  
  next();
};

// Optional: Middleware untuk multiple API keys (jika butuh beberapa key)
const validateMultipleApiKeys = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false,
      message: 'API key is required.' 
    });
  }
  
  // Split multiple keys dari .env dengan koma
  const validKeys = process.env.API_KEYS?.split(',') || [];
  
  if (!validKeys.includes(apiKey)) {
    return res.status(403).json({ 
      success: false,
      message: 'Invalid API key.' 
    });
  }
  
  next();
};

module.exports = { 
  validateApiKey, 
  validateMultipleApiKeys,
  generateApiKey 
};

