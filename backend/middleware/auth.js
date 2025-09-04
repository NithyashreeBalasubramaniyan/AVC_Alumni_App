// middleware/auth.js
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId || !decoded.role) return res.status(401).json({ success: false, message: 'Invalid token' });

    // fetch user to confirm existence
    const role = decoded.role.toUpperCase();
    let user;
    if (role === 'STUDENT') user = await prisma.student.findUnique({ where: { id: decoded.userId }});
    else if (role === 'ALUMNI') user = await prisma.alumni.findUnique({ where: { id: decoded.userId }});
    else if (role === 'TEACHER') user = await prisma.teacher.findUnique({ where: { id: decoded.userId }});

    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = { userId: decoded.userId, role: role, name: user.name, id: user.id };
    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorize = (expectedRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (req.user.role !== expectedRole.toUpperCase()) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticateToken, authorize };
