const prisma = require('../../../config/prisma');

// Get KPSP statistics (Admin)
const getKPSPStatistics = async (req, res) => {
  try {
    const totalScreenings = await prisma.skriningKPSP.count();

    const resultStats = await prisma.skriningKPSP.groupBy({
      by: ['hasil'],
      _count: {
        hasil: true
      }
    });

    const categoryStats = await prisma.skriningKPSP.groupBy({
      by: ['kategoriId'],
      _count: {
        kategoriId: true
      }
    });

    // Get category names
    const categories = await prisma.kategoriUsiaKPSP.findMany({
      where: {
        id: {
          in: categoryStats.map(s => s.kategoriId)
        }
      },
      select: {
        id: true,
        nama: true,
        kode: true
      }
    });

    const categoryStatsWithNames = categoryStats.map(stat => ({
      ...stat,
      categoryId: stat.kategoriId,
      result: stat._count.kategoriId,
      category: categories.find(c => c.id === stat.kategoriId) ? {
        id: categories.find(c => c.id === stat.kategoriId).id,
        name: categories.find(c => c.id === stat.kategoriId).nama,
        code: categories.find(c => c.id === stat.kategoriId).kode
      } : null
    }));

    // Map result stats to frontend format
    const mappedResultStats = resultStats.map(r => ({
      result: r.hasil,
      _count: { result: r._count.hasil }
    }));

    res.json({
      totalScreenings,
      resultStats: mappedResultStats,
      categoryStats: categoryStatsWithNames
    });
  } catch (error) {
    console.error('Error in getKPSPStatistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getKPSPStatistics;