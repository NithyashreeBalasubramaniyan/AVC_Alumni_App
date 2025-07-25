const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Student Registration
const registerStudent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, register_number, phone_number, date_of_birth, password } = req.body;

    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { register_number },
          { phone_number }
        ]
      }
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this register number or phone number'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new student
    const student = await prisma.student.create({
      data: {
        name,
        register_number,
        phone_number,
        date_of_birth: new Date(date_of_birth),
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = generateToken(student.id);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        student: {
          id: student.id,
          name: student.name,
          register_number: student.register_number,
          is_verified: student.is_verified
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Student Login
const loginStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { register_number, password } = req.body;

    // Find student by register number
    const student = await prisma.student.findUnique({
      where: { register_number }
    });
    console.log('Student found:', student);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Debug JWT secret
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

    // Generate JWT token
    const token = generateToken(student.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        student: {
          id: student.id,
          name: student.name,
          register_number: student.register_number,
          phone_number: student.phone_number,
          date_of_birth: student.date_of_birth,
          is_verified: student.is_verified
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Student Verification (matches the form data)
const verifyStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, register_number, phone_number, date_of_birth, password } = req.body;

    // Find student with exact match
    const student = await prisma.student.findFirst({
      where: {
        name,
        register_number,
        phone_number,
        date_of_birth: new Date(date_of_birth)
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No student found with the provided details'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Update verification status
    await prisma.student.update({
      where: { id: student.id },
      data: { is_verified: true }
    });

    // Generate JWT token
    const token = generateToken(student.id);

    res.json({
      success: true,
      message: 'Verification successful!',
      data: {
        student: {
          id: student.id,
          name: student.name,
          register_number: student.register_number,
          phone_number: student.phone_number,
          date_of_birth: student.date_of_birth,
          is_verified: true
        },
        token
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Student Profile
const getProfile = async (req, res) => {
  try {
    const student = req.user; // From auth middleware

    res.json({
      success: true,
      data: {
        student
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  verifyStudent,
  getProfile
}; 