const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const pengguna = await prisma.pengguna.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
          sudahLengkapiProfil: true
        }
      });

      if (!pengguna) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Map to expected format for compatibility
      req.user = {
        id: pengguna.id,
        name: pengguna.nama,
        email: pengguna.email,
        role: pengguna.role,
        hasCompletedProfile: pengguna.sudahLengkapiProfil
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = { protect, adminOnly };