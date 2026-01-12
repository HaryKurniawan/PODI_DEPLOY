const prisma = require('../../config/prisma');

// Get child immunization progress/roadmap
const getChildImmunizationRoadmap = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const child = await prisma.dataAnak.findUnique({
      where: { id: childId },
      include: {
        pengguna: { select: { id: true } }
      }
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    if (child.pengguna.id !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Tidak memiliki akses' });
    }

    // Get all templates
    const templates = await prisma.templateImunisasi.findMany({
      include: {
        vaksin: true
      },
      orderBy: {
        usiaInBulan: 'asc'
      }
    });

    // Get child's immunizations
    const childImmunizations = await prisma.imunisasiAnak.findMany({
      where: { anakId: childId },
      include: { vaksin: true }
    });

    // Build roadmap with status
    const roadmap = templates.map(template => ({
      ageRange: template.rentangUsia,
      ageInMonths: template.usiaInBulan,
      vaccines: template.vaksin.map(vaccine => {
        const completed = childImmunizations.find(
          imm => imm.vaksinId === vaccine.id && imm.status === 'SELESAI'
        );

        return {
          id: vaccine.id,
          name: vaccine.nama,
          dose: vaccine.dosis,
          description: vaccine.deskripsi,
          recommendedAge: vaccine.usiaRekomendasi,
          status: completed ? 'completed' : 'pending',
          vaccinationDate: completed?.tanggalVaksinasi || null,
          notes: completed?.catatan || null
        };
      })
    }));

    // Calculate progress
    const totalVaccines = roadmap.reduce((sum, template) => sum + template.vaccines.length, 0);
    const completedVaccines = roadmap.reduce(
      (sum, template) => sum + template.vaccines.filter(v => v.status === 'completed').length,
      0
    );

    res.json({
      child: {
        id: child.id,
        fullName: child.namaLengkap,
        nik: child.nik,
        birthDate: child.tanggalLahir
      },
      roadmap,
      progress: {
        total: totalVaccines,
        completed: completedVaccines,
        percentage: totalVaccines > 0 ? Math.round((completedVaccines / totalVaccines) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getChildImmunizationRoadmap;
