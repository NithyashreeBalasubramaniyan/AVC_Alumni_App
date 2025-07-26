// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { convertExcelToJson } = require('../utils/excelParser');

router.post('/upload-excel', upload.single('file'), (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');

    const jsonData = convertExcelToJson(req.file.path);
    fs.unlinkSync(req.file.path); // Clean up uploaded file

    res.json({ success: true, data: jsonData });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
