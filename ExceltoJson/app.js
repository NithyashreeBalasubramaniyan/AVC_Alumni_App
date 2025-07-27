const express = require('express');
const multer = require('multer');
const { parseExcelToJson } = require('./utils/excelParser'); // Correct import

const app = express();
const PORT = 5000;

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

// Route definition
app.post('/api/upload-excel', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const jsonData = parseExcelToJson(req.file.buffer);
    return res.status(200).json({ success: true, data: jsonData });
  } catch (err) {
    console.error('Excel parsing error:', err);
    return res.status(500).json({ success: false, message: 'Failed to parse Excel file' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
