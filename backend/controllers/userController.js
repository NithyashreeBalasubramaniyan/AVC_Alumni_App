const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Update profile
const updateUserProfile = async (req, res) => {
  // 1. Add 'Bio' to the destructured request body
  const { id, role, Linkedin_id, Experience, Gender, Company, job_role, Bio } = req.body;

  if (!id || !role) {
    return res.status(400).json({ success: false, message: 'ID and role are required' });
  }

  let model;
  switch (role.toLowerCase()) {
    case 'alumni': model = prisma.alumni; break;
    case 'student': model = prisma.student; break;
    case 'teacher': model = prisma.teacher; break;
    default:
      return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  let profile_image = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const updatedUser = await model.update({
      where: { id: parseInt(id) },
      data: {
        Linkedin_id,
        Experience,
        Gender,
        Company,
        job_role,
        profile_image,
        Bio, // 2. Add 'Bio' to the data being updated
      },
    });

    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// Get profile by registration number
const { Router } = require('express');
const { param, validationResult } = require('express-validator');
const router = Router();


const getProfileByRegNo = async (req, res) => {
  const { token } = req.body;
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const role = user.role;
    const id = user.userId;

    let model;
    switch (role) {
      case 'alumni': model = prisma.alumni; break;
      case 'student': model = prisma.student; break;
      case 'teacher': model = prisma.teacher; break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const userData = await model.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        reg_no: true,
        mail: true,
        job_role: true,
        Company: true,
        profile_image: true,
        Linkedin_id: true,
        Experience: true,
        Gender: true,
        Bio: true, // 3. Add 'Bio' to the fields being selected
      },
    });

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User data not found' });
    }

    return res.status(200).json({ success: true, data: {...userData, role: role} });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



module.exports = {
  updateUserProfile,
  getProfileByRegNo,
};