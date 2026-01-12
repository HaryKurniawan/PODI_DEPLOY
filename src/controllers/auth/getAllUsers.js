const prisma = require('../../config/prisma');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const daftarPengguna = await prisma.pengguna.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        sudahLengkapiProfil: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map to frontend expected format
    const users = daftarPengguna.map(p => ({
      id: p.id,
      name: p.nama,
      email: p.email,
      role: p.role,
      hasCompletedProfile: p.sudahLengkapiProfil,
      createdAt: p.createdAt
    }));

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllUsers;