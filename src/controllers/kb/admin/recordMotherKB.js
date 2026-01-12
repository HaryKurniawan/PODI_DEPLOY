const prisma = require('../../../config/prisma');

/**
 * Record KB data for a mother during posyandu visit
 * POST /kb/record
 */
const recordMotherKB = async (req, res) => {
    try {
        const {
            userId,        // ID user ibu
            scheduleId,    // ID jadwal posyandu (opsional)
            method,        // Metode KB
            startDate,     // Tanggal mulai
            status,        // ACTIVE/INACTIVE
            notes          // Catatan
        } = req.body;

        // Validation
        if (!userId || !method || !startDate) {
            return res.status(400).json({
                message: 'userId, method, dan startDate wajib diisi'
            });
        }

        // Validate method
        const validMethods = [
            'PIL', 'SUNTIK_1BULAN', 'SUNTIK_3BULAN',
            'IUD', 'IMPLANT', 'MOW', 'MOP', 'KONDOM', 'ALAMIAH'
        ];
        if (!validMethods.includes(method)) {
            return res.status(400).json({
                message: `Metode KB tidak valid. Pilih salah satu: ${validMethods.join(', ')}`
            });
        }

        // Check if user exists
        const pengguna = await prisma.pengguna.findUnique({
            where: { id: userId }
        });

        if (!pengguna) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // If there's an active KB record for this user, set it to INACTIVE
        if (status === 'ACTIVE' || status === 'AKTIF') {
            await prisma.catatanKBIbu.updateMany({
                where: {
                    penggunaId: userId,
                    status: 'AKTIF'
                },
                data: {
                    status: 'TIDAK_AKTIF'
                }
            });
        }

        // Create new KB record
        const kbRecord = await prisma.catatanKBIbu.create({
            data: {
                penggunaId: userId,
                jadwalId: scheduleId || null,
                metode: method,
                tanggalMulai: new Date(startDate),
                status: (status === 'ACTIVE' || status === 'AKTIF') ? 'AKTIF' : 'TIDAK_AKTIF',
                catatan: notes || null,
                dicatatOleh: req.user?.name || 'Admin Posyandu'
            },
            include: {
                pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                        dataIbu: {
                            select: {
                                namaLengkap: true
                            }
                        }
                    }
                },
                jadwal: {
                    select: {
                        id: true,
                        tanggalJadwal: true,
                        lokasi: true
                    }
                }
            }
        });

        // Map to frontend format
        res.status(201).json({
            message: 'Data KB berhasil dicatat',
            data: {
                id: kbRecord.id,
                userId: kbRecord.penggunaId,
                scheduleId: kbRecord.jadwalId,
                method: kbRecord.metode,
                startDate: kbRecord.tanggalMulai,
                status: kbRecord.status === 'AKTIF' ? 'ACTIVE' : 'INACTIVE',
                notes: kbRecord.catatan,
                recordedBy: kbRecord.dicatatOleh,
                user: kbRecord.pengguna ? {
                    id: kbRecord.pengguna.id,
                    name: kbRecord.pengguna.nama,
                    email: kbRecord.pengguna.email,
                    motherData: kbRecord.pengguna.dataIbu ? {
                        fullName: kbRecord.pengguna.dataIbu.namaLengkap
                    } : null
                } : null,
                schedule: kbRecord.jadwal ? {
                    id: kbRecord.jadwal.id,
                    scheduleDate: kbRecord.jadwal.tanggalJadwal,
                    location: kbRecord.jadwal.lokasi
                } : null
            }
        });

    } catch (error) {
        console.error('Error recording KB data:', error);
        res.status(500).json({
            message: 'Gagal mencatat data KB',
            error: error.message
        });
    }
};

module.exports = recordMotherKB;
