// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('reg_no').notEmpty().trim().withMessage('Register number is required'),
  body('ph_no').notEmpty().trim().withMessage('Phone is required'),
  body('dob').notEmpty().withMessage('DOB is required'),
  body('mail').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
];

const loginValidation = [
  body('reg_no').notEmpty().trim().withMessage('Register number is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register/alumni', registerValidation, authController.registeralumni);
router.post('/login/alumni', loginValidation, authController.loginalumni);

router.post('/register/student', registerValidation, authController.registerStudent);
router.post('/login/student', loginValidation, authController.loginStudent);

router.post('/register/teacher', registerValidation, authController.registerTeacher);
router.post('/login/teacher', loginValidation, authController.loginTeacher);

// protected
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/verify', authenticateToken, authController.verify);

module.exports = router;
