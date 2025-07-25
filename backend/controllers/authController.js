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

// Alumini Registration
const registerAlumini = async (req, res) => {
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
    
    const { name, reg_no, ph_no, dob, password, mail } = req.body;
    
    // Check if Alumini already exists
    const duplicateAlumini = await prisma.Alumini.findFirst({
      where: {
        OR: [
          { reg_no },
          { mail },
        ]
      }
    })

    if(duplicateAlumini)
    {
      return res.status(401).json({
        success: false,
        message: 'already Registered, login your account'
      })
    }

    const existingAlumini = await prisma.ExistingAlumini.findFirst({
      where: {
        OR: [
          { reg_no },
          { mail },
        ]
      }
    });
    
    console.log(`existing ${existingAlumini}`)
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new Alumini
    const alumini = await prisma.Alumini.create({
      data: {
        name,
        reg_no,
        ph_no,
        mail,
        dob: new Date(dob),
        password: hashedPassword
      }
    });
    
    // Generate JWT token
    const token = generateToken(alumini.id);
    
    res.status(201).json({
      success: true,
      message: 'Alumini registered successfully',
      data: {
        alumini: {
          id: alumini.id,
          name: alumini.name,
          reg_no: alumini.reg_no,
          is_verified: alumini.is_verified
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

// alumini login
const loginAlumini = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reg_no, password } = req.body;

    // Find alumini by register number
    const alumini = await prisma.Alumini.findUnique({
      where: { reg_no }
    });
    console.log('alumini found:', alumini);

    if (!alumini) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, alumini.password);
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
    const token = generateToken(alumini.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        alumini: {
          id: alumini.id,
          name: alumini.name,
          reg_no: alumini.reg_no,
          ph_no: alumini.ph_no,
          dob: alumini.dob,
          is_verified: alumini.is_verified
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

    const { name, reg_no, ph_no, dob, password } = req.body;

    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { reg_no },
          { ph_no }
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
        reg_no,
        ph_no,
        dob: new Date(dob),
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
          reg_no: student.reg_no,
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

    const { reg_no, password } = req.body;

    // Find student by register number
    const student = await prisma.student.findUnique({
      where: { reg_no }
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
          reg_no: student.reg_no,
          ph_no: student.ph_no,
          dob: student.dob,
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

    const { name, reg_no, ph_no, dob, password } = req.body;

    // Find student with exact match
    const student = await prisma.student.findFirst({
      where: {
        name,
        reg_no,
        ph_no,
        dob: new Date(dob)
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
          reg_no: student.reg_no,
          ph_no: student.ph_no,
          dob: student.dob,
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
  loginAlumini,


  loginStudent,
  verifyStudent,
  getProfile,
  registerAlumini
}; 