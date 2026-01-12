const prisma = require('../../../config/prisma');

// Get single screening detail
const getScreeningDetail = async (req, res) => {
  try {
    const { screeningId } = req.params;

    const screening = await prisma.skriningKPSP.findUnique({
      where: { id: screeningId },
      include: {
        anak: {
          select: {
            namaLengkap: true,
            tanggalLahir: true,
            penggunaId: true
          }
        },
        kategori: {
          select: {
            nama: true,
            kode: true
          }
        },
        jawaban: {
          include: {
            pertanyaan: true
          },
          orderBy: {
            pertanyaan: {
              nomorPertanyaan: 'asc'
            }
          }
        }
      }
    });

    if (!screening) {
      return res.status(404).json({ message: 'Skrining tidak ditemukan' });
    }

    // Verify user owns this screening
    if (screening.anak.penggunaId !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    // Map to frontend format
    const mappedScreening = {
      id: screening.id,
      childId: screening.anakId,
      categoryId: screening.kategoriId,
      screeningDate: screening.tanggalSkrining,
      ageAtScreening: screening.usiaSaatSkrining,
      totalYes: screening.totalYa,
      totalNo: screening.totalTidak,
      result: screening.hasil,
      notes: screening.catatan,
      recommendedAction: screening.rekomendasiTindakan,
      child: {
        fullName: screening.anak.namaLengkap,
        birthDate: screening.anak.tanggalLahir,
        userId: screening.anak.penggunaId
      },
      category: screening.kategori ? {
        name: screening.kategori.nama,
        code: screening.kategori.kode
      } : null,
      answers: screening.jawaban.map(j => ({
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
    };

    res.json(mappedScreening);
  } catch (error) {
    console.error('Error in getScreeningDetail:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getScreeningDetail;