const prisma = require('../../../config/prisma');

// Create KPSP question (Admin)
const createKPSPQuestion = async (req, res) => {
  try {
    const {
      categoryId,
      questionNumber,
      questionText,
      developmentArea,
      instruction
    } = req.body;

    const question = await prisma.pertanyaanKPSP.create({
      data: {
        kategoriId: categoryId,
        nomorPertanyaan: questionNumber,
        teksPertanyaan: questionText,
        areaPerkembangan: developmentArea,
        instruksi: instruction
      }
    });

    // Map to frontend format
    const mappedQuestion = {
      id: question.id,
      categoryId: question.kategoriId,
      questionNumber: question.nomorPertanyaan,
      questionText: question.teksPertanyaan,
      developmentArea: question.areaPerkembangan,
      instruction: question.instruksi
    };

    res.json({
      message: 'Pertanyaan KPSP berhasil dibuat',
      data: mappedQuestion
    });
  } catch (error) {
    console.error('Error in createKPSPQuestion:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createKPSPQuestion;
