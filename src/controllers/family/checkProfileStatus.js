const prisma = require('../../config/prisma');

// Check if user has completed profile
const checkProfileStatus = async (req, res) => {
  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: req.user.id },
      select: {
        sudahLengkapiProfil: true
      }
    });

    res.json({ hasCompletedProfile: pengguna.sudahLengkapiProfil });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = checkProfileStatus;