const express = require('express');
const router = express.Router();
const { updateUserProfile, getProfileByRegNo } = require('../controllers/userController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Profile update with optional image upload
router.post('/update', upload.single('profile_image'), updateUserProfile);

// GET profile by reg no
router.post('/profile', getProfileByRegNo);

module.exports = router;
