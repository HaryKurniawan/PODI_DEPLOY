const prisma = require('../../../config/prisma');

// Update KPSP question (Admin)
const updateKPSPQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, developmentArea, instruction } = req.body;

    const question = await prisma.pertanyaanKPSP.update({
      where: { id },
      data: {
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
      message: 'Pertanyaan KPSP berhasil diperbarui',
      data: mappedQuestion
    });
  } catch (error) {
    console.error('Error in updateKPSPQuestion:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateKPSPQuestion;
