const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createPost, getPost, updatePost, deletePost, searchPosts } = require('../controllers/postController');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.post('/create', upload.single('image'), createPost);
router.get('/getall', getPost);
router.put('/update', upload.single('image'), updatePost);
router.delete('/delete', deletePost);
router.get('/search', searchPosts);

module.exports = router;
