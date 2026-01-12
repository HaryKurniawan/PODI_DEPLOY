const prisma = require('../../../config/prisma');

const cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const penggunaId = req.user.id;

    const pendaftaran = await prisma.pendaftaranPosyandu.findFirst({
      where: {
        id: registrationId,
        penggunaId: penggunaId
      }
    });

    if (!pendaftaran) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (pendaftaran.status !== 'TERDAFTAR') {
      return res.status(400).json({ message: 'Cannot cancel this registration' });
    }

    await prisma.pendaftaranPosyandu.update({
      where: { id: registrationId },
      data: { status: 'DIBATALKAN' }
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = cancelRegistration;