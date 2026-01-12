/**
 * Data Change Controller
 * Handles data change requests with admin approval
 */

const prisma = require('../config/prisma');

/**
 * Submit a data change request
 * POST /api/data-change
 */
const submitChangeRequest = async (req, res) => {
    try {
        const penggunaId = req.user.id;
        const { targetType, targetId, newData } = req.body;

        if (!targetType || !targetId || !newData) {
            return res.status(400).json({ message: 'Data tidak lengkap' });
        }

        // Map targetType to Indonesian enum
        const tipeTarget = targetType === 'MOTHER' ? 'IBU' : targetType === 'SPOUSE' ? 'SUAMI' : 'ANAK';

        // Get old data based on target type
        let oldData = null;
        let changedFields = [];

        if (targetType === 'MOTHER') {
            const ibu = await prisma.dataIbu.findUnique({
                where: { id: targetId }
            });
            if (!ibu || ibu.penggunaId !== penggunaId) {
                return res.status(404).json({ message: 'Data ibu tidak ditemukan' });
            }
            oldData = ibu;
        } else if (targetType === 'SPOUSE') {
            const suami = await prisma.dataSuami.findUnique({
                where: { id: targetId }
            });
            if (!suami || suami.penggunaId !== penggunaId) {
                return res.status(404).json({ message: 'Data suami tidak ditemukan' });
            }
            oldData = suami;
        } else if (targetType === 'CHILD') {
            const anak = await prisma.dataAnak.findUnique({
                where: { id: targetId }
            });
            if (!anak || anak.penggunaId !== penggunaId) {
                return res.status(404).json({ message: 'Data anak tidak ditemukan' });
            }
            oldData = anak;
        } else {
            return res.status(400).json({ message: 'Tipe data tidak valid' });
        }

        // Determine changed fields
        for (const key of Object.keys(newData)) {
            if (oldData[key] !== undefined && String(oldData[key]) !== String(newData[key])) {
                changedFields.push(key);
            }
        }

        if (changedFields.length === 0) {
            return res.status(400).json({ message: 'Tidak ada perubahan data' });
        }

        // Check for existing pending request
        const existingRequest = await prisma.permintaanPerubahanData.findFirst({
            where: {
                penggunaId,
                tipeTarget,
                targetId,
                status: 'MENUNGGU'
            }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'Sudah ada permintaan perubahan yang menunggu persetujuan'
            });
        }

        // Create change request
        const changeRequest = await prisma.permintaanPerubahanData.create({
            data: {
                penggunaId,
                tipeTarget,
                targetId,
                dataLama: oldData,
                dataBaru: newData,
                fieldBerubah: changedFields,
                status: 'MENUNGGU'
            }
        });

        res.status(201).json({
            message: 'Permintaan perubahan berhasil diajukan',
            request: mapRequestToFrontend(changeRequest)
        });

    } catch (error) {
        console.error('Error submitting change request:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Get my change requests
 * GET /api/data-change/my-requests
 */
const getMyChangeRequests = async (req, res) => {
    try {
        const penggunaId = req.user.id;

        const requests = await prisma.permintaanPerubahanData.findMany({
            where: { penggunaId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests.map(mapRequestToFrontend));
    } catch (error) {
        console.error('Error getting my change requests:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Get pending change requests (Admin)
 * GET /api/data-change/pending
 */
const getPendingRequests = async (req, res) => {
    try {
        const requests = await prisma.permintaanPerubahanData.findMany({
            where: { status: 'MENUNGGU' },
            include: {
                pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json(requests.map(r => ({
            ...mapRequestToFrontend(r),
            user: r.pengguna ? {
                id: r.pengguna.id,
                name: r.pengguna.nama,
                email: r.pengguna.email
            } : null
        })));
    } catch (error) {
        console.error('Error getting pending requests:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Get all change requests (Admin)
 * GET /api/data-change/all
 */
const getAllRequests = async (req, res) => {
    try {
        const requests = await prisma.permintaanPerubahanData.findMany({
            include: {
                pengguna: {
                    select: {
                        id: true,
                        nama: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        res.json(requests.map(r => ({
            ...mapRequestToFrontend(r),
            user: r.pengguna ? {
                id: r.pengguna.id,
                name: r.pengguna.nama,
                email: r.pengguna.email
            } : null
        })));
    } catch (error) {
        console.error('Error getting all requests:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Approve change request (Admin)
 * PUT /api/data-change/:id/approve
 */
const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { reviewNotes } = req.body;

        const request = await prisma.permintaanPerubahanData.findUnique({
            where: { id }
        });

        if (!request) {
            return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
        }

        if (request.status !== 'MENUNGGU') {
            return res.status(400).json({ message: 'Permintaan sudah diproses' });
        }

        // Apply changes based on target type
        const newData = request.dataBaru;

        if (request.tipeTarget === 'IBU') {
            await prisma.dataIbu.update({
                where: { id: request.targetId },
                data: {
                    namaLengkap: newData.fullName || newData.namaLengkap,
                    noTelepon: newData.phoneNumber || newData.noTelepon,
                    nik: newData.nik,
                    tempatLahir: newData.birthPlace || newData.tempatLahir,
                    tanggalLahir: (newData.birthDate || newData.tanggalLahir) ? new Date(newData.birthDate || newData.tanggalLahir) : undefined,
                    pendidikan: newData.education || newData.pendidikan,
                    pekerjaan: newData.occupation || newData.pekerjaan,
                    golonganDarah: newData.bloodType || newData.golonganDarah,
                    jkn: newData.jkn,
                    fasilitasTK1: newData.facilityTK1 || newData.fasilitasTK1
                }
            });
        } else if (request.tipeTarget === 'SUAMI') {
            await prisma.dataSuami.update({
                where: { id: request.targetId },
                data: {
                    namaLengkap: newData.fullName || newData.namaLengkap,
                    nik: newData.nik,
                    pekerjaan: newData.occupation || newData.pekerjaan,
                    noTelepon: newData.phoneNumber || newData.noTelepon
                }
            });
        } else if (request.tipeTarget === 'ANAK') {
            await prisma.dataAnak.update({
                where: { id: request.targetId },
                data: {
                    namaLengkap: newData.fullName || newData.namaLengkap,
                    nik: newData.nik,
                    noAkta: newData.birthCertificate || newData.noAkta,
                    urutanAnak: newData.childOrder || newData.urutanAnak,
                    golonganDarah: newData.bloodType || newData.golonganDarah,
                    jenisKelamin: newData.gender || newData.jenisKelamin,
                    tempatLahir: newData.birthPlace || newData.tempatLahir,
                    tanggalLahir: (newData.birthDate || newData.tanggalLahir) ? new Date(newData.birthDate || newData.tanggalLahir) : undefined
                }
            });
        }

        // Update request status
        const updatedRequest = await prisma.permintaanPerubahanData.update({
            where: { id },
            data: {
                status: 'DISETUJUI',
                direviewOleh: adminId,
                direviewPada: new Date(),
                catatanReview: reviewNotes
            }
        });

        res.json({
            message: 'Permintaan perubahan disetujui',
            request: mapRequestToFrontend(updatedRequest)
        });

    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Reject change request (Admin)
 * PUT /api/data-change/:id/reject
 */
const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { reviewNotes } = req.body;

        const request = await prisma.permintaanPerubahanData.findUnique({
            where: { id }
        });

        if (!request) {
            return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
        }

        if (request.status !== 'MENUNGGU') {
            return res.status(400).json({ message: 'Permintaan sudah diproses' });
        }

        const updatedRequest = await prisma.permintaanPerubahanData.update({
            where: { id },
            data: {
                status: 'DITOLAK',
                direviewOleh: adminId,
                direviewPada: new Date(),
                catatanReview: reviewNotes
            }
        });

        res.json({
            message: 'Permintaan perubahan ditolak',
            request: mapRequestToFrontend(updatedRequest)
        });

    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Helper to map request to frontend format
function mapRequestToFrontend(r) {
    return {
        id: r.id,
        userId: r.penggunaId,
        targetType: r.tipeTarget === 'IBU' ? 'MOTHER' : r.tipeTarget === 'SUAMI' ? 'SPOUSE' : 'CHILD',
        targetId: r.targetId,
        oldData: r.dataLama,
        newData: r.dataBaru,
        changedFields: r.fieldBerubah,
        status: r.status === 'MENUNGGU' ? 'PENDING' : r.status === 'DISETUJUI' ? 'APPROVED' : 'REJECTED',
        reviewedBy: r.direviewOleh,
        reviewedAt: r.direviewPada,
        reviewNotes: r.catatanReview,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
    };
}

module.exports = {
    submitChangeRequest,
    getMyChangeRequests,
    getPendingRequests,
    getAllRequests,
    approveRequest,
    rejectRequest
};
