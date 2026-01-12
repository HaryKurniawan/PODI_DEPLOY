const prisma = require('../../config/prisma');

// Get dashboard statistics for admin
const getDashboardStats = async (req, res) => {
    try {
        // Get all counts in parallel
        const [
            totalChildren,
            totalSchedules,
            totalExaminations,
            totalKPSPScreenings
        ] = await Promise.all([
            prisma.dataAnak.count(),
            prisma.jadwalPosyandu.count({
                where: { aktif: true }
            }),
            prisma.pemeriksaanAnak.count(),
            prisma.skriningKPSP.count()
        ]);

        res.json({
            totalChildren,
            totalSchedules,
            totalExaminations,
            totalKPSPScreenings
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getDashboardStats;
