const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// decode JWT Token
const decodeToken = (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
};

const createPost = async (req, res) => {
  try {
    const { caption, token } = req.body;
    const file = req.file;

    // Use relative path only
    const imagePath = file ? `/${file.path.replace(/\\/g, '/')}` : null;

    let studentId = null;
    let alumniId = null;
    let teacherId = null;

    const jwtResult = decodeToken(token);
    const role = jwtResult.role.toUpperCase();

    if (role === 'STUDENT') studentId = jwtResult.userId;
    else if (role === 'ALUMNI') alumniId = jwtResult.userId;
    else teacherId = jwtResult.userId;

    const post = await prisma.post.create({
      data: {
        caption,
        image: imagePath,
        role,
        studentId,
        alumniId,
        teacherId,
      },
      include: {
        student: { select: { name: true, job_role: true } },
        alumni: { select: { name: true, job_role: true } },
        teacher: { select: { name: true, job_role: true } },
      },
    });

    const userName = post.student?.name || post.alumni?.name || post.teacher?.name || "Unknown";

    res.status(201).json({ ...post, userName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get all post
const getPost = async (req, res) =>{
    try{
        const allPost = await prisma.post.findMany({
        include: {
        student: { select: { name: true, job_role: true, profile_image: true } },
        alumni: { select: { name: true, job_role: true, profile_image: true } },
        teacher: { select: { name: true, job_role: true, profile_image: true } },
      }})
        res.status(200).json({success: true, message: "get all posts", data: allPost })
    }
    catch (err) {
    res.status(500).json({ error: err.message });
    }
}


module.exports = { createPost, getPost }