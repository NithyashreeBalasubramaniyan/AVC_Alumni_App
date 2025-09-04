const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Create post
const createPost = async (req, res) => {
  try {
    const { caption, category } = req.body;
    const role = req.user?.role;
    const userId = req.user?.userId;

    if (!role || !userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user details" });
    }

    // If student, check permission
    if (role.toUpperCase() === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { id: userId } });
      if (!student || !student.canPost) {
        return res.status(403).json({ error: "Permission denied. Request not approved yet." });
      }
    }

    const image = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : null;

    const post = await prisma.post.create({
      data: {
        caption,
        image,
        category,
        role,
        studentId: role.toUpperCase() === "STUDENT" ? userId : null,
        alumniId: role.toUpperCase() === "ALUMNI" ? userId : null,
        teacherId: role.toUpperCase() === "TEACHER" ? userId : null,
      }
    });

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { student: true, alumni: true, teacher: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Event Posts
const getPostEvent = async (req, res) => {
  try {
    const allPost = await prisma.post.findMany({
      where: { category: "event" },
      include: {
        student: { select: { name: true, job_role: true, profile_image: true } },
        alumni: { select: { name: true, job_role: true, profile_image: true } },
        teacher: { select: { name: true, job_role: true, profile_image: true } },
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, message: "get all posts", data: allPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Post by ID
const getPostById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const profile = await prisma.post.findUnique({
      where: { id },
      include: {
        student: true,
        alumni: true,
        teacher: true
      }
    });
    if (!profile) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ success: true, message: "profile fetched", data: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const { postId, caption, token } = req.body;
    const file = req.file;
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const jwtResult = decodeToken(token);
    if (!jwtResult) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const userId = jwtResult.userId;
    const role = jwtResult.role?.toUpperCase();

    const existingPost = await prisma.post.findUnique({ where: { id: postIdInt } });
    if (!existingPost) return res.status(404).json({ message: 'Post not found' });

    const unauthorized =
      (role === 'STUDENT' && existingPost.studentId !== userId) ||
      (role === 'ALUMNI' && existingPost.alumniId !== userId) ||
      (role === 'TEACHER' && existingPost.teacherId !== userId);

    if (unauthorized) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    const updatedImage = file ? `/${file.path.replace(/\\/g, '/')}` : existingPost.image;

    const updatedPost = await prisma.post.update({
      where: { id: postIdInt },
      data: {
        caption: caption || existingPost.caption,
        image: updatedImage
      },
      include: { student: true, alumni: true, teacher: true }
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
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const jwtResult = decodeToken(token);
    if (!jwtResult) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const userId = jwtResult.userId;
    const role = jwtResult.role?.toUpperCase();

    const existingPost = await prisma.post.findUnique({ where: { id: postIdInt } });
    if (!existingPost) return res.status(404).json({ message: 'Post not found' });

    const unauthorized =
      (role === 'STUDENT' && existingPost.studentId !== userId) ||
      (role === 'ALUMNI' && existingPost.alumniId !== userId) ||
      (role === 'TEACHER' && existingPost.teacherId !== userId);

    if (unauthorized) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await prisma.post.delete({ where: { id: postIdInt } });
    res.status(200).json({ success: true, message: 'Post deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { student: { name: { contains: name, mode: 'insensitive' } } },
          { alumni: { name: { contains: name, mode: 'insensitive' } } },
          { teacher: { name: { contains: name, mode: 'insensitive' } } },
        ],
      },
      include: { student: true, alumni: true, teacher: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: posts });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostEvent,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
};
