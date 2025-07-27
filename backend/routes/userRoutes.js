const express = require('express');
const { updateUserProfile } = require('../controllers/userController');
const upload = require('../middleware/profileimage'); // Ensure this path is correct

const router = express.Router();

// Multipart form with image
router.patch('/update-profile', upload.single('profile_image'), updateUserProfile);

module.exports = router;
