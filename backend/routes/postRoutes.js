const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createPost,
  getPosts,
  getPostEvent,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
} = require('../controllers/postController');

// Multer storage
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

// Routes
router.post('/create', upload.single('image'), createPost);
router.get('/getall', getPosts);
router.get('/getallevent', getPostEvent);
router.get('/get/:id', getPostById);
router.put('/update', upload.single('image'), updatePost);
router.delete('/delete', deletePost);
router.get('/search', searchPosts);

module.exports = router;
