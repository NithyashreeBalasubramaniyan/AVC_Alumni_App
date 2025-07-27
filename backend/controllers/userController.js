// controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateUserProfile = async (req, res) => {
  const { id, role, Linkedin_id, Experience, Gender, Company, job_role } = req.body;

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
      },
    });

    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

module.exports = { updateUserProfile }; 
