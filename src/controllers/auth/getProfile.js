const prisma = require('../../config/prisma');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        sudahLengkapiProfil: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Map to frontend expected format
    res.json({
      id: pengguna.id,
      name: pengguna.nama,
      email: pengguna.email,
      role: pengguna.role,
      hasCompletedProfile: pengguna.sudahLengkapiProfil,
      createdAt: pengguna.createdAt,
      updatedAt: pengguna.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getProfile;
