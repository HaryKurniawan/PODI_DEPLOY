const prisma = require('../../config/prisma');

// Complete profile submission
const completeProfile = async (req, res) => {
  try {
    // Update user profile status
    await prisma.pengguna.update({
      where: { id: req.user.id },
      data: { sudahLengkapiProfil: true }
    });

    res.json({ message: 'Profile completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = completeProfile;