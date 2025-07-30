const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Secure token verification
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // ✅ Use verify
  } catch (err) {
    return null; // Will return "Invalid or expired token"
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { caption, token } = req.body;
    const file = req.file;
    const jwtResult = decodeToken(token);

    if (!jwtResult) return res.status(401).json({ message: 'Invalid or expired token' });

    const imagePath = file ? `/${file.path.replace(/\\/g, '/')}` : null;
    const role = jwtResult.role.toUpperCase();
    const userId = jwtResult.userId;

    let studentId = null, alumniId = null, teacherId = null;

    if (role === 'STUDENT') studentId = userId;
    else if (role === 'ALUMNI') alumniId = userId;
    else if (role === 'TEACHER') teacherId = userId;

    const post = await prisma.post.create({
      data: { caption, image: imagePath, role, studentId, alumniId, teacherId },
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

// Get All Posts
const getPost = async (req, res) => {
  try {
    const allPost = await prisma.post.findMany({
      include: {
        student: { select: { name: true, job_role: true, profile_image: true } },
        alumni: { select: { name: true, job_role: true, profile_image: true } },
        teacher: { select: { name: true, job_role: true, profile_image: true } },
      }
    });
    res.status(200).json({ success: true, message: "get all posts", data: allPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const { postId, caption, token } = req.body;
    const file = req.file;

    // Validate postId
    const postIdInt = parseInt(postId);
    if (isNaN(postIdInt)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Decode and validate JWT
    const jwtResult = decodeToken(token);
    if (!jwtResult) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const userId = jwtResult.userId;
    const role = jwtResult.role?.toUpperCase();

    // Fetch the post
    const existingPost = await prisma.post.findUnique({ where: { id: postIdInt } });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Authorization check
    const unauthorized =
      (role === 'STUDENT' && existingPost.studentId !== userId) ||
      (role === 'ALUMNI' && existingPost.alumniId !== userId) ||
      (role === 'TEACHER' && existingPost.teacherId !== userId);

    if (unauthorized) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    // Handle image update
    const updatedImage = file ? `/${file.path.replace(/\\/g, '/')}` : existingPost.image;

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postIdInt },
      data: {
        caption: caption || existingPost.caption,
        image: updatedImage
      },
      include: {
        student: { select: { name: true, job_role: true } },
        alumni: { select: { name: true, job_role: true } },
        teacher: { select: { name: true, job_role: true } },
      },
    });

    res.status(200).json({ success: true, data: updatedPost });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Post
const deletePost = async (req, res) => {
  try {
    const { postId, token } = req.body;

    // Validate postId
    const postIdInt = parseInt(postId);
    if (isNaN(postIdInt)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Decode token
    const jwtResult = decodeToken(token);
    if (!jwtResult) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const userId = jwtResult.userId;
    const role = jwtResult.role?.toUpperCase();

    // Fetch the post
    const existingPost = await prisma.post.findUnique({ where: { id: postIdInt } });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Authorization check
    const unauthorized =
      (role === 'STUDENT' && existingPost.studentId !== userId) ||
      (role === 'ALUMNI' && existingPost.alumniId !== userId) ||
      (role === 'TEACHER' && existingPost.teacherId !== userId);

    if (unauthorized) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Delete post
    await prisma.post.delete({ where: { id: postIdInt } });

    res.status(200).json({ success: true, message: 'Post deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createPost, getPost, updatePost, deletePost };
