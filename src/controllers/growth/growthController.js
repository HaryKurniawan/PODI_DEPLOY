/**
 * Growth Controller
 * API controller untuk fitur Tumbuh Kembang Anak
 */

const prisma = require('../../config/prisma');
const { calculateAllIndicators, calculateAgeInMonths } = require('./zScoreCalculator');
const { classifyAllIndicators, determineOverallStatus, generateRecommendations } = require('./statusClassifier');

/**
 * Get growth analysis untuk satu anak
 * GET /api/growth/child/:childId
 */
const getChildGrowthAnalysis = async (req, res) => {
    try {
        const { childId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Get child data
        const child = await prisma.dataAnak.findUnique({
            where: { id: childId },
            include: {
                pengguna: true,
                pemeriksaan: {
                    orderBy: { tanggalPemeriksaan: 'desc' },
                    take: 1
                }
            }
        });

        if (!child) {
            return res.status(404).json({ message: 'Data anak tidak ditemukan' });
        }

        // Check authorization (admin can access all, user only their children)
        if (userRole !== 'ADMIN' && child.penggunaId !== userId) {
            return res.status(403).json({ message: 'Tidak memiliki akses ke data anak ini' });
        }

        // Cek apakah ada data pemeriksaan
        if (child.pemeriksaan.length === 0) {
            return res.json({
                child: {
                    id: child.id,
                    fullName: child.namaLengkap,
                    birthDate: child.tanggalLahir,
                    gender: child.jenisKelamin || 'L',
                    ageMonths: calculateAgeInMonths(child.tanggalLahir)
                },
                hasExamination: false,
                message: 'Belum ada data pemeriksaan untuk anak ini'
            });
        }

        const latestExam = child.pemeriksaan[0];
        const gender = child.jenisKelamin || 'L'; // Default ke L jika belum ada

        // Calculate all Z-Scores
        const analysis = calculateAllIndicators(
            latestExam.beratBadan,
            latestExam.tinggiBadan,
            latestExam.lingkarKepala,
            child.tanggalLahir,
            gender
        );

        // Classify status
        const classifications = classifyAllIndicators(analysis.indicators);
        const overallStatus = determineOverallStatus(classifications);
        const recommendations = generateRecommendations(classifications);

        res.json({
            child: {
                id: child.id,
                fullName: child.namaLengkap,
                birthDate: child.tanggalLahir,
                gender: gender,
                ageMonths: analysis.ageMonths
            },
            hasExamination: true,
            latestExamination: {
                id: latestExam.id,
                date: latestExam.tanggalPemeriksaan,
                weight: latestExam.beratBadan,
                height: latestExam.tinggiBadan,
                headCircumference: latestExam.lingkarKepala,
                armCircumference: latestExam.lingkarLengan,
                notes: latestExam.catatan,
                immunization: latestExam.imunisasi
            },
            zScores: {
                weightForAge: {
                    value: analysis.indicators.weightForAge.zScore,
                    median: analysis.indicators.weightForAge.median,
                    ...classifications.weightForAge
                },
                heightForAge: {
                    value: analysis.indicators.heightForAge.zScore,
                    median: analysis.indicators.heightForAge.median,
                    ...classifications.heightForAge
                },
                weightForHeight: {
                    value: analysis.indicators.weightForHeight.zScore,
                    median: analysis.indicators.weightForHeight.median,
                    ...classifications.weightForHeight
                },
                headCircumferenceForAge: {
                    value: analysis.indicators.headCircumferenceForAge.zScore,
                    median: analysis.indicators.headCircumferenceForAge.median,
                    ...classifications.headCircumferenceForAge
                }
            },
            overallStatus,
            recommendations
        });

    } catch (error) {
        console.error('Error in getChildGrowthAnalysis:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Get growth history untuk grafik
 * GET /api/growth/history/:childId
 */
const getGrowthHistory = async (req, res) => {
    try {
        const { childId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Get child with all examinations
        const child = await prisma.dataAnak.findUnique({
            where: { id: childId },
            include: {
                pemeriksaan: {
                    orderBy: { tanggalPemeriksaan: 'asc' }
                }
            }
        });

        if (!child) {
            return res.status(404).json({ message: 'Data anak tidak ditemukan' });
        }

        // Check authorization
        if (userRole !== 'ADMIN' && child.penggunaId !== userId) {
            return res.status(403).json({ message: 'Tidak memiliki akses' });
        }

        const gender = child.jenisKelamin || 'L';

        // Calculate Z-Scores for each examination
        const history = child.pemeriksaan.map(exam => {
            const ageAtExam = calculateAgeInMonths(child.tanggalLahir);
            const analysis = calculateAllIndicators(
                exam.beratBadan,
                exam.tinggiBadan,
                exam.lingkarKepala,
                child.tanggalLahir,
                gender
            );

            return {
                date: exam.tanggalPemeriksaan,
                ageMonths: analysis.ageMonths,
                measurements: {
                    weight: exam.beratBadan,
                    height: exam.tinggiBadan,
                    headCircumference: exam.lingkarKepala,
                    armCircumference: exam.lingkarLengan
                },
                zScores: {
                    weightForAge: analysis.indicators.weightForAge.zScore,
                    heightForAge: analysis.indicators.heightForAge.zScore,
                    weightForHeight: analysis.indicators.weightForHeight.zScore,
                    headCircumferenceForAge: analysis.indicators.headCircumferenceForAge.zScore
                }
            };
        });

        res.json({
            child: {
                id: child.id,
                fullName: child.namaLengkap,
                birthDate: child.tanggalLahir,
                gender: gender
            },
            history
        });

    } catch (error) {
        console.error('Error in getGrowthHistory:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Get growth status semua anak user
 * GET /api/growth/my-children
 */
const getMyChildrenGrowthStatus = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all children with latest examination
        const children = await prisma.dataAnak.findMany({
            where: { penggunaId: userId },
            include: {
                pemeriksaan: {
                    orderBy: { tanggalPemeriksaan: 'desc' },
                    take: 1
                }
            }
        });

        const results = children.map(child => {
            const gender = child.jenisKelamin || 'L';
            const ageMonths = calculateAgeInMonths(child.tanggalLahir);

            if (child.pemeriksaan.length === 0) {
                return {
                    child: {
                        id: child.id,
                        fullName: child.namaLengkap,
                        birthDate: child.tanggalLahir,
                        gender,
                        ageMonths
                    },
                    hasExamination: false,
                    overallStatus: {
                        overallStatus: 'Belum Ada Data',
                        priority: 'unknown',
                        color: 'gray',
                        recommendation: 'Lakukan pemeriksaan di posyandu'
                    }
                };
            }

            const exam = child.pemeriksaan[0];
            const analysis = calculateAllIndicators(
                exam.beratBadan,
                exam.tinggiBadan,
                exam.lingkarKepala,
                child.tanggalLahir,
                gender
            );
            const classifications = classifyAllIndicators(analysis.indicators);
            const overallStatus = determineOverallStatus(classifications);

            return {
                child: {
                    id: child.id,
                    fullName: child.namaLengkap,
                    birthDate: child.tanggalLahir,
                    gender,
                    ageMonths
                },
                hasExamination: true,
                latestExamination: {
                    date: exam.tanggalPemeriksaan,
                    weight: exam.beratBadan,
                    height: exam.tinggiBadan
                },
                overallStatus,
                quickStatus: {
                    stunting: classifications.heightForAge.severity !== 'normal',
                    wasting: classifications.weightForHeight.status.includes('Kurus'),
                    overweight: classifications.weightForHeight.status.includes('Lebih') || classifications.weightForHeight.status.includes('Obesitas')
                }
            };
        });

        res.json(results);

    } catch (error) {
        console.error('Error in getMyChildrenGrowthStatus:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Update gender anak (jika belum terisi)
 * PUT /api/growth/child/:childId/gender
 */
const updateChildGender = async (req, res) => {
    try {
        const { childId } = req.params;
        const { gender } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!gender || !['L', 'P'].includes(gender)) {
            return res.status(400).json({ message: 'Gender harus L atau P' });
        }

        // Get child
        const child = await prisma.dataAnak.findUnique({
            where: { id: childId }
        });

        if (!child) {
            return res.status(404).json({ message: 'Anak tidak ditemukan' });
        }

        // Check authorization
        if (userRole !== 'ADMIN' && child.penggunaId !== userId) {
            return res.status(403).json({ message: 'Tidak memiliki akses' });
        }

        // Update gender
        const updated = await prisma.dataAnak.update({
            where: { id: childId },
            data: { jenisKelamin: gender }
        });

        res.json({
            message: 'Gender berhasil diupdate',
            child: {
                id: updated.id,
                fullName: updated.namaLengkap,
                gender: updated.jenisKelamin
            }
        });

    } catch (error) {
        console.error('Error in updateChildGender:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

module.exports = {
    getChildGrowthAnalysis,
    getGrowthHistory,
    getMyChildrenGrowthStatus,
    updateChildGender
};
