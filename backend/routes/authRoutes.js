const express = require('express');
const { body } = require('express-validator');
const {
  registerAlumini,
  loginAlumini,

  registerStudent,
  loginStudent,
  verifyStudent,

  getProfile
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('reg_no').notEmpty().trim().withMessage('Register number is required'),
  body('ph_no').isMobilePhone().withMessage('Valid phone number is required'),
  body('dob').isDate().withMessage('Valid date of birth is required'),
  body('mail').notEmpty().trim().withMessage('Valid mail is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('reg_no').notEmpty().trim().withMessage('Register number is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const verificationValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('reg_no').notEmpty().trim().withMessage('Register number is required'),
  body('ph_no').notEmpty().trim().withMessage('Phone number is required'),
  body('dob').isDate().withMessage('Valid date of birth is required'),
  body('password').notEmpty().withMessage('Password is required')
];

//Alumini Routes
router.post('/register/alumini', registerValidation, registerAlumini);
router.post('/login/alumini', loginValidation, loginAlumini);

//Student Routes
router.post('/register/student', registerValidation, registerStudent);
router.post('/login/student', loginValidation, loginStudent);

router.post('/verify', verificationValidation, verifyStudent);
router.get('/profile', authenticateToken, getProfile);

module.exports = router; 