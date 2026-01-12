const prisma = require('../../config/prisma');

// Save child data
const saveChildData = async (req, res) => {
  try {
    const { children } = req.body;

    if (!children || !Array.isArray(children) || children.length === 0) {
      return res.status(400).json({ message: 'Data anak tidak valid' });
    }

    // Check for duplicate NIK within the submitted data (only for non-empty NIKs)
    const niks = children.map(c => c.nik).filter(nik => nik && nik.trim() !== '');
    const uniqueNiks = new Set(niks);
    if (niks.length !== uniqueNiks.size) {
      return res.status(400).json({
        message: 'NIK anak tidak boleh sama',
        field: 'nik'
      });
    }

    // Check for duplicate birth certificate within the submitted data (only for non-empty certs)
    const certs = children.map(c => c.birthCertificate).filter(cert => cert && cert.trim() !== '');
    const uniqueCerts = new Set(certs);
    if (certs.length !== uniqueCerts.size) {
      return res.status(400).json({
        message: 'No. Akta Kelahiran tidak boleh sama',
        field: 'birthCertificate'
      });
    }

    // Get current user's children for exclusion
    const currentChildren = await prisma.dataAnak.findMany({
      where: { penggunaId: req.user.id },
      select: { id: true, nik: true, noAkta: true }
    });
    const currentNiks = currentChildren.map(c => c.nik).filter(Boolean);
    const currentCerts = currentChildren.map(c => c.noAkta).filter(Boolean);

    // Check if any NIK is already used by another user's child (only for non-empty NIKs)
    for (const child of children) {
      if (!child.nik || child.nik.trim() === '') continue;
      if (currentNiks.includes(child.nik)) continue;

      const existingNik = await prisma.dataAnak.findFirst({
        where: {
          nik: child.nik,
          NOT: { penggunaId: req.user.id }
        }
      });
      if (existingNik) {
        return res.status(400).json({
          message: `NIK ${child.nik} sudah terdaftar untuk anak lain`,
          field: 'nik',
          childName: child.fullName
        });
      }
    }

    // Check if any birth certificate is already used (only for non-empty certs)
    for (const child of children) {
      if (!child.birthCertificate || child.birthCertificate.trim() === '') continue;
      if (currentCerts.includes(child.birthCertificate)) continue;

      const existingCert = await prisma.dataAnak.findFirst({
        where: {
          noAkta: child.birthCertificate,
          NOT: { penggunaId: req.user.id }
        }
      });
      if (existingCert) {
        return res.status(400).json({
          message: `No. Akta Kelahiran ${child.birthCertificate} sudah terdaftar untuk anak lain`,
          field: 'birthCertificate',
          childName: child.fullName
        });
      }
    }

    // Delete existing children
    await prisma.dataAnak.deleteMany({
      where: { penggunaId: req.user.id }
    });

    // Create new children data
    const childrenData = await prisma.dataAnak.createMany({
      data: children.map(child => ({
        penggunaId: req.user.id,
        namaLengkap: child.fullName,
        nik: child.nik && child.nik.trim() !== '' ? child.nik : null,
        noAkta: child.birthCertificate && child.birthCertificate.trim() !== '' ? child.birthCertificate : null,
        urutanAnak: parseInt(child.childOrder, 10) || 1,
        golonganDarah: child.bloodType,
        jenisKelamin: child.gender || 'L',
        tempatLahir: child.birthPlace,
        tanggalLahir: new Date(child.birthDate)
      }))
    });

    res.json({ message: 'Children data saved successfully', data: childrenData });
  } catch (error) {
    // Handle unique constraint error
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      let message = 'Data sudah terdaftar';
      if (field === 'nik') message = 'NIK sudah terdaftar untuk anak lain';
      if (field === 'noAkta') message = 'No. Akta Kelahiran sudah terdaftar untuk anak lain';
      return res.status(400).json({ message, field });
    }
    console.error('Error saving child data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = saveChildData;