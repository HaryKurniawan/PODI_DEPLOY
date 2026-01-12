const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const generateToken = require('./utils/generateToken');

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const pengguna = await prisma.pengguna.findUnique({
      where: { email }
    });

    if (!pengguna) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, pengguna.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!pengguna.emailTerverifikasi) {
      return res.status(403).json({
        message: 'Email belum diverifikasi. Silakan cek email Anda.',
        requiresVerification: true,
        email: pengguna.email
      });
    }

    res.json({
      id: pengguna.id,
      name: pengguna.nama,
      email: pengguna.email,
      role: pengguna.role,
      hasCompletedProfile: pengguna.sudahLengkapiProfil,
      token: generateToken(pengguna.id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = login;