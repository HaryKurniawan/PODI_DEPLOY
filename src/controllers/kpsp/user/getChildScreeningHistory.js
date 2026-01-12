const prisma = require('../../../config/prisma');

// Get screening history for a child
const getChildScreeningHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    // Verify child belongs to user
    const child = await prisma.dataAnak.findFirst({
      where: {
        id: childId,
        penggunaId: req.user.id
      }
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    const screenings = await prisma.skriningKPSP.findMany({
      where: { anakId: childId },
      include: {
        kategori: {
          select: {
            nama: true,
            kode: true
          }
        },
        jawaban: {
          include: {
            pertanyaan: true
          }
        }
      },
      orderBy: {
        tanggalSkrining: 'desc'
      }
    });

    // Map to frontend format
    const mappedScreenings = screenings.map(s => ({
      id: s.id,
      childId: s.anakId,
      categoryId: s.kategoriId,
      screeningDate: s.tanggalSkrining,
      ageAtScreening: s.usiaSaatSkrining,
      totalYes: s.totalYa,
      totalNo: s.totalTidak,
      result: s.hasil,
      notes: s.catatan,
      recommendedAction: s.rekomendasiTindakan,
      category: s.kategori ? {
        name: s.kategori.nama,
        code: s.kategori.kode
      } : null,
      answers: s.jawaban.map(j => ({
        id: j.id,
        questionId: j.pertanyaanId,
        answer: j.jawaban,
        question: j.pertanyaan ? {
          id: j.pertanyaan.id,
          questionNumber: j.pertanyaan.nomorPertanyaan,
          questionText: j.pertanyaan.teksPertanyaan,
          developmentArea: j.pertanyaan.areaPerkembangan,
          instruction: j.pertanyaan.instruksi
        } : null
      }))
    }));

    res.json(mappedScreenings);
  } catch (error) {
    console.error('Error in getChildScreeningHistory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getChildScreeningHistory;