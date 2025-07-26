const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Custom storage with original extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // e.g. .jpg
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const { createPost } = require('../controllers/postController');

router.post('/create', upload.single('image'), createPost);

module.exports = router;
