const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const updateUserProfile = async (req, res) => {
  // Log the incoming request body to debug what the frontend is sending
  console.log('--- Received request to update profile ---');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file); // Log file info if you're handling uploads
  console.log('-----------------------------------------');

  const { id, role, Linkedin_id, Experience, Gender, Company, job_role, Bio } = req.body;

  if (!id || !role) {
    console.error('Validation Error: ID and role are required fields.');
    return res.status(400).json({ success: false, message: 'ID and role are required' });
  }

  let model;
  switch (role.toLowerCase()) {
    case 'alumni': model = prisma.alumni; break;
    case 'student': model = prisma.student; break;
    case 'teacher': model = prisma.teacher; break;
    default:
      console.error(`Invalid Role Error: Received role '${role}'.`);
      return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  // Prepare the data for update, filtering out any undefined values
  const dataToUpdate = {
    Linkedin_id,
    Experience,
    Gender,
    Company,
    job_role,
    Bio,
  };

  if (req.file) {
    dataToUpdate.profile_image = `/uploads/${req.file.filename}`;
  }

  // Remove keys with undefined values so they don't overwrite existing data
  Object.keys(dataToUpdate).forEach(key => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  console.log('Data being sent to Prisma for update:', dataToUpdate);

  if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ success: false, message: 'No data provided to update.' });
  }


  try {
    const updatedUser = await model.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    console.log('Profile updated successfully for user ID:', id);
    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Prisma Update Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile due to a server error.' });
  }
};


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
          Bio: true,
          Post: {
            select: {
              id: true,
              caption: true,
              image: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
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
