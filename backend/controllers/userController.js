const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Update profile
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

// Get profile by registration number
const getProfileByRegNo = async (req, res) => {
  const { reg_no } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { reg_no },
      select: {
        name: true,
        reg_no: true,
        job_role: true,
        Company: true,
        profile_image: true,
        Linkedin_id: true,
        Experience: true,
        Gender: true
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  updateUserProfile,
  getProfileByRegNo
};
