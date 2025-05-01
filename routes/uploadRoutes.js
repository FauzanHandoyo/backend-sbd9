const express = require('express');
const upload = require('../middleware/uploadMiddleware'); // Multer middleware
const cloudinary = require('../cloudinaryConfig');

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ error });

        res.json({
          message: "Image uploaded successfully",
          url: cloudinaryResult.secure_url, // Store this in `items` table
          public_id: cloudinaryResult.public_id,
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error });
  }
});

module.exports = router;
