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

const createPost = async (req, res) => {
  try {
    const { caption, token } = req.body;
    const file = req.file;

  
    const jwtResult = decodeToken(token);
    if (!jwtResult) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

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
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'An error occurred' });
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

// Get Posts by ID
const getPostById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log(id)
  try {
    const profile = await prisma.post.findUnique({
      where: {
        id: id
      },
      include: {
        student: { select: {
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
        } },
        alumni: { select: {
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
        } },
        teacher: { select: {
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
        } },
      }
    });
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

//search posts

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
      include: {
        student: true,
        alumni: true,
        teacher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ data: posts });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};




module.exports = { createPost, getPost, updatePost, deletePost,searchPosts,getPostById };
