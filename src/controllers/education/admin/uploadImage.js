const cloudinary = require('../../../config/cloudinary');

// Upload image to Cloudinary
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File gambar wajib diunggah' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'education',
            resource_type: 'auto'
        });

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Error in uploadImage:', error);
        res.status(500).json({ message: 'Gagal mengunggah gambar', error: error.message });
    }
};

module.exports = uploadImage;
