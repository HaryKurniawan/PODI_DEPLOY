const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('./utils/generateToken');
const { sendVerificationEmail } = require('../../services/emailService');

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const penggunaExists = await prisma.pengguna.findUnique({
      where: { email }
    });

    if (penggunaExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const pengguna = await prisma.pengguna.create({
      data: {
        nama: name,
        email,
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'PENGGUNA',
        tokenVerifikasiEmail: hashedToken,
        kadaluarsaVerifikasiEmail: verifyExpires,
        emailTerverifikasi: false
      }
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(pengguna.email, pengguna.nama, verifyToken).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    res.status(201).json({
      success: true,
      email: pengguna.email,
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = register;