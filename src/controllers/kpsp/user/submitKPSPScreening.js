const prisma = require('../../../config/prisma');

// Submit KPSP screening
const submitKPSPScreening = async (req, res) => {
  try {
    const { childId, categoryId, answers, ageAtScreening, notes } = req.body;

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

    // Calculate results
    const totalYes = answers.filter(a => a.answer === true).length;
    const totalNo = answers.filter(a => a.answer === false).length;
    const percentage = (totalYes / answers.length) * 100;

    // Determine result based on percentage
    let result;
    if (percentage >= 80) {
      result = 'SESUAI';
    } else if (percentage >= 50) {
      result = 'MERAGUKAN';
    } else {
      result = 'PENYIMPANGAN';
    }

    // Get recommended action
    let recommendedAction;
    if (result === 'SESUAI') {
      recommendedAction = 'Perkembangan anak sesuai. Lanjutkan pemantauan rutin dan berikan stimulasi sesuai usia.';
    } else if (result === 'MERAGUKAN') {
      recommendedAction = 'Anak perlu stimulasi tambahan. Ulangi skrining setelah 2 minggu dengan stimulasi intensif. Konsultasikan dengan petugas kesehatan.';
    } else {
      recommendedAction = 'Kemungkinan ada penyimpangan perkembangan. Segera rujuk ke dokter spesialis anak atau ahli tumbuh kembang untuk evaluasi lebih lanjut.';
    }

    // Create screening record with answers
    const screening = await prisma.skriningKPSP.create({
      data: {
        anakId: childId,
        kategoriId: categoryId,
        usiaSaatSkrining: ageAtScreening,
        totalYa: totalYes,
        totalTidak: totalNo,
        hasil: result,
        catatan: notes,
        rekomendasiTindakan: recommendedAction,
        jawaban: {
          create: answers.map(answer => ({
            pertanyaanId: answer.questionId,
            jawaban: answer.answer
          }))
        }
      },
      include: {
        anak: {
          select: {
            namaLengkap: true,
            tanggalLahir: true
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
          }
        }
      }
    });

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
        birthDate: screening.anak.tanggalLahir
      },
      category: screening.kategori ? {
        name: screening.kategori.nama,
        code: screening.kategori.kode
      } : null
    };

    res.json({
      message: 'Skrining KPSP berhasil disimpan',
      data: mappedScreening
    });
  } catch (error) {
    console.error('Error in submitKPSPScreening:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = submitKPSPScreening;