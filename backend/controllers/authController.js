const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// alumni Registration
const registeralumni = async (req, res) => {
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
    
    // Check if alumni already exists
    const duplicatealumni = await prisma.alumni.findFirst({
      where: {
        AND: [
          { reg_no },
          { dob: new Date(dob) },
        ]
      }
    })

      if (typeof reg_no !== 'string' || reg_no.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Registration number must be exactly 12 characters'
      });
    }

    if(duplicatealumni)
    {
      return res.status(401).json({
        success: false,
        message: 'already Registered, login your account'
      })
    }

    const existingalumni = await prisma.existingalumni.findFirst({
      where: {
        AND: [
          { reg_no },
          { dob: new Date(dob) },
        ]
      }
    });
    
    if(!existingalumni){
      return res.status(401).json({
        success: false,
        message: 'your data not in existing alumni table'
      })
    }

    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new alumni
    const alumni = await prisma.alumni.create({
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
    const token = generateToken(alumni.id, "alumni");
    
    res.status(201).json({
      success: true,
      message: 'alumni registered successfully',
      data: {
        alumni: {
          id: alumni.id,
          name: alumni.name,
          reg_no: alumni.reg_no,
          is_verified: alumni.is_verified
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

// alumni login
const loginalumni = async (req, res) => {
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

    // Find alumni by register number
    const alumni = await prisma.alumni.findUnique({
      where: { reg_no }
    });
    console.log('alumni found:', alumni);

    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, alumni.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    // Generate JWT token
    const token = generateToken(alumni.id, "alumni");

    // Debug JWT secret
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        alumni: {
          id: alumni.id,
          name: alumni.name,
          reg_no: alumni.reg_no,
          ph_no: alumni.ph_no,
          dob: alumni.dob,
          is_verified: alumni.is_verified
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

//-------------------------------------------------------------------

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
    
    const { name, reg_no, ph_no, dob, password, mail } = req.body;
    
    // Check if Student already exists
    const duplicateStudent = await prisma.Student.findFirst({
      where: {
        AND: [
          { reg_no },
          { dob: new Date(dob) },
        ]
      }
    })
      if (typeof reg_no !== 'string' || reg_no.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Registration number must be exactly 12 characters'
      });
    }


    if(duplicateStudent)
    {
      return res.status(401).json({
        success: false,
        message: 'already Registered, login your account'
      })
    }

    //check if the student is in existing student table 
    const existingStudent = await prisma.ExistingStudent.findFirst({
      where: {
        AND: [
          { reg_no },
          { dob: new Date(dob) },
        ]
      }
    });
    
    if(!existingStudent){
      return res.status(401).json({
        success: false,
        message: 'your data not in existing student table'
      })
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new Student
    const student = await prisma.Student.create({
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
    const token = generateToken(student.id, "student");
    
    res.status(201).json({
      success: true,
      message: 'student registered successfully',
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

    // Find Student by register number
    const student = await prisma.Student.findUnique({
      where: { reg_no }
    });
    console.log('student found:', student);

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

    // Generate JWT token
    const token = generateToken(student.id, "student");

    // Debug JWT secret
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

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


// ---------------------------------------------------------------------


// Teacher Registration
const registerTeacher = async (req, res) => {
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
    
    // Check if Teacher already exists
    const duplicateTeacher = await prisma.teacher.findFirst({
      where: {
        OR: [
          { reg_no },
          { dob: new Date(dob) },
        ]
      }
    })

    

    if(duplicateTeacher)
    {
      return res.status(401).json({
        success: false,
        message: 'already Registered, login your account'
      })
    }

    const existingTeacher = await prisma.existingTeacher.findFirst({
      where: {
        AND: [
          { reg_no },
          { dob: new Date(dob) },
        ]
      }
    });
    
    if(!existingTeacher){
      return res.status(401).json({
        success: false,
        message: 'your data not in existing teacher table'
      })
    }
    console.log(`existing ${existingTeacher}`)
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new teacher
    const teacher = await prisma.teacher.create({
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
    const token = generateToken(teacher.id, "teacher");
    
    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      data: {
        teacher: {
          id: teacher.id,
          name: teacher.name,
          reg_no: teacher.reg_no,
          is_verified: teacher.is_verified
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

// Teacher login
const loginTeacher = async (req, res) => {
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

    // Find teacher by register number
    const teacher = await prisma.teacher.findUnique({
      where: { reg_no }
    });
    console.log('teacher found:', teacher);

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(teacher.id, "teacher");

    // Debug JWT secret
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);


    res.json({
      success: true,
      message: 'Login successful',
      data: {
        teacher: {
          id: teacher.id,
          name: teacher.name,
          reg_no: teacher.reg_no,
          ph_no: teacher.ph_no,
          dob: teacher.dob,
          is_verified: teacher.is_verified
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
  
  registeralumni,
  loginalumni,
  
  registerStudent,
  loginStudent,
  
  registerTeacher,
  loginTeacher,
  
  
  getProfile,

}; 