// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../prismaClient');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// ALUMNI
const registeralumni = async (req, res) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const { name, reg_no, ph_no, dob, password, mail } = req.body;
    if (typeof reg_no !== 'string' || reg_no.length !== 12) return res.status(400).json({ success:false, message:'Registration number must be 12 chars' });

    const duplicate = await prisma.alumni.findUnique({ where:{ reg_no }});
    if (duplicate) return res.status(409).json({ success:false, message:'Already registered' });

    // check existing alumni table
    const existing = await prisma.existingAlumni.findUnique({ where:{ reg_no }});
    if (!existing) return res.status(400).json({ success:false, message:'Your data not in existing alumni table' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const alumni = await prisma.alumni.create({ data:{ name, reg_no, ph_no, mail, dob: new Date(dob), password: hashedPassword }});
    const token = generateToken(alumni.id, 'ALUMNI');

    res.status(201).json({ success:true, data:{ alumni, token }});
  } catch(err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Internal server error' });
  }
};

const loginalumni = async (req,res) => {
  try {
    const { reg_no, password } = req.body;
    const alumni = await prisma.alumni.findUnique({ where:{ reg_no }});
    if(!alumni) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const valid = await bcrypt.compare(password, alumni.password);
    if(!valid) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const token = generateToken(alumni.id, 'ALUMNI');
    res.json({ success:true, data:{ alumni, token }});
  } catch(err) {
    console.error(err); res.status(500).json({ success:false, message:'Internal server error' });
  }
};

// STUDENT
const registerStudent = async (req,res) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const { name, reg_no, ph_no, dob, password, mail } = req.body;
    if (typeof reg_no !== 'string' || reg_no.length !== 12) return res.status(400).json({ success:false, message:'Registration number must be 12 chars' });

    const duplicate = await prisma.student.findUnique({ where:{ reg_no }});
    if(duplicate) return res.status(409).json({ success:false, message:'Already registered' });

    const existing = await prisma.existingStudent.findUnique({ where:{ reg_no }});
    if(!existing) return res.status(400).json({ success:false, message:'Not in existing student table' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.student.create({ data:{ name, reg_no, ph_no, mail, dob: new Date(dob), password: hashedPassword }});
    const token = generateToken(student.id,'STUDENT');

    res.status(201).json({ success:true, data:{ student, token }});
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:'Internal server error' }); }
};

const loginStudent = async (req,res) => {
  try {
    const { reg_no, password } = req.body;
    const student = await prisma.student.findUnique({ where:{ reg_no }});
    if(!student) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const valid = await bcrypt.compare(password, student.password);
    if(!valid) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const token = generateToken(student.id,'STUDENT');
    res.json({ success:true, data:{ student, token }});
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:'Internal server error' }); }
};

// TEACHER
const registerTeacher = async (req,res) => {
  try {
    const { name, reg_no, ph_no, dob, password, mail } = req.body;
    const duplicate = await prisma.teacher.findUnique({ where:{ reg_no }});
    if(duplicate) return res.status(409).json({ success:false, message:'Already registered' });

    const existing = await prisma.existingTeacher.findUnique({ where:{ reg_no }});
    if(!existing) return res.status(400).json({ success:false, message:'Not in existing teacher table' });

    const hashedPassword = await bcrypt.hash(password,10);
    const teacher = await prisma.teacher.create({ data:{ name, reg_no, ph_no, mail, dob: new Date(dob), password: hashedPassword }});
    const token = generateToken(teacher.id,'TEACHER');

    res.status(201).json({ success:true, data:{ teacher, token }});
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:'Internal server error' }); }
};

const loginTeacher = async (req,res) => {
  try {
    const { reg_no, password } = req.body;
    const teacher = await prisma.teacher.findUnique({ where:{ reg_no }});
    if(!teacher) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const valid = await bcrypt.compare(password, teacher.password);
    if(!valid) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const token = generateToken(teacher.id,'TEACHER');
    res.json({ success:true, data:{ teacher, token }});
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:'Internal server error' }); }
};

// PROFILE (protected)
const getProfile = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { id: userId },
        select: { id: true, name: true, reg_no: true, mail: true, canPost: true, posts: true }
      });
      return res.json({ success: true, data: { ...student, role } });
    }
    if (role === 'ALUMNI') {
      const alumni = await prisma.alumni.findUnique({
        where: { id: userId },
        select: { id: true, name: true, reg_no: true, mail: true, posts: true }
      });
      return res.json({ success: true, data: { ...alumni, role } });
    }
    if (role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        select: { id: true, name: true, reg_no: true, mail: true, posts: true }
      });
      return res.json({ success: true, data: { ...teacher, role } });
    }
    res.status(400).json({ success:false, message:'Unknown role' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Server error' });
  }
};

// VERIFY (teacher-only) - set canPost true for student
const verify = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (req.user.role !== 'TEACHER') return res.status(403).json({ success:false, message:'Only teachers can verify' });

    const student = await prisma.student.update({
      where: { id: parseInt(studentId) },
      data: { canPost: true }
    });
    res.json({ success:true, message:'Student verified', data: student });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message:'Server error' });
  }
};

module.exports = {
  registeralumni, loginalumni,
  registerStudent, loginStudent,
  registerTeacher, loginTeacher,
  getProfile, verify
};
