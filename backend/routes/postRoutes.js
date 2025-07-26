const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createPost, getPost } = require('../controllers/postController');

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


router.post('/create', upload.single('image'), createPost);
router.get('/getall',  getPost);

module.exports = router;
