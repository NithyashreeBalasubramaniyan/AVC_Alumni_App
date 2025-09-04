// controllers/requestController.js
const prisma = require('../prismaClient');

// Student creates a post request
exports.createPostRequest = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') return res.status(403).json({ success:false, message:'Only students can request' });
    const studentId = req.user.userId;

    const existing = await prisma.postRequest.findFirst({ where: { studentId, status: 'PENDING' } });
    if (existing) return res.status(400).json({ success:false, message:'You already have a pending request' });

    const request = await prisma.postRequest.create({ data: { studentId, status: 'PENDING' } });
    res.json({ success:true, data: request });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message:'Server error' });
  }
};

// Teacher gets all requests
exports.getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') return res.status(403).json({ success:false, message:'Only teachers can view requests' });
    const requests = await prisma.postRequest.findMany({ include: { student: { select: { id: true, name: true, reg_no: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success:true, data: requests });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message:'Server error' });
  }
};

// Teacher approve/deny (body: { requestId, action: 'APPROVED'|'REJECTED' })
exports.updatePostRequestStatus = async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') return res.status(403).json({ success:false, message:'Only teachers can modify requests' });
    const { requestId, status } = req.body;
    if (!['APPROVED','REJECTED'].includes(status)) return res.status(400).json({ success:false, message:'Invalid status' });

    const updated = await prisma.postRequest.update({ where: { id: Number(requestId) }, data: { status } });
    if (status === 'APPROVED') {
      await prisma.student.update({ where: { id: updated.studentId }, data: { canPost: true } });
    }
    res.json({ success:true, data: updated });
  } catch (err) { console.error(err); res.status(500).json({ success:false, message:'Server error' }); }
};
