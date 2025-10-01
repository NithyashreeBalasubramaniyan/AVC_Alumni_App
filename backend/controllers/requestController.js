// controllers/requestController.js
const prisma = require('../prismaClient');

// ============================
// Student creates a post request
// ============================
exports.createPostRequest = async (req, res) => {
  try {
    // Only students can create post requests
    if ((req.user?.role || '').toUpperCase() !== 'STUDENT') {
      return res.status(403).json({ success: false, message: 'Only students can request' });
    }

    const studentId = req.user.userId;

    // Prevent duplicate pending requests
    const existing = await prisma.postRequest.findFirst({
      where: { studentId, status: 'PENDING' },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending request' });
    }

    // Fetch student to copy department
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student not found' });
    }

    if (!student.department) {
      return res.status(400).json({ success: false, message: 'Student has no department assigned' });
    }

    // Create request with department copied from student
    const request = await prisma.postRequest.create({
      data: {
        studentId,
        department: student.department,
        status: 'PENDING',
      },
    });

    res.json({ success: true, data: request });
  } catch (err) {
    console.error('Error in createPostRequest:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================
// Teacher gets requests (only from their department)
// ============================
exports.getAllRequests = async (req, res) => {
  try {
    if ((req.user?.role || '').toUpperCase() !== 'TEACHER') {
      return res.status(403).json({ success: false, message: 'Only teachers can view requests' });
    }

    const teacherId = req.user.userId;
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });

    if (!teacher) {
      return res.status(400).json({ success: false, message: 'Teacher not found' });
    }

    if (!teacher.department) {
      return res.status(400).json({ success: false, message: 'Teacher has no department assigned' });
    }

    const requests = await prisma.postRequest.findMany({
      where: { department: teacher.department },
      include: {
        student: { select: { id: true, name: true, reg_no: true, department: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error('Error in getAllRequests:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================
// Teacher approve/deny request
// ============================
// Expected body: { requestId, status: "APPROVED" | "REJECTED" }
exports.updatePostRequestStatus = async (req, res) => {
  try {
    if ((req.user?.role || '').toUpperCase() !== 'TEACHER') {
      return res.status(403).json({ success: false, message: 'Only teachers can modify requests' });
    }

    const { requestId, status } = req.body;
    if (!requestId) return res.status(400).json({ success: false, message: 'requestId is required' });
    if (!['APPROVED', 'REJECTED'].includes((status || '').toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be APPROVED or REJECTED' });
    }

    const teacher = await prisma.teacher.findUnique({ where: { id: req.user.userId } });
    if (!teacher) return res.status(400).json({ success: false, message: 'Teacher not found' });

    const request = await prisma.postRequest.findUnique({ where: { id: Number(requestId) } });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    // ensure teacher can only update requests belonging to their department
    if (request.department !== teacher.department) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this request' });
    }

    const updated = await prisma.postRequest.update({
      where: { id: Number(requestId) },
      data: { status: status.toUpperCase() },
    });

    // If approved, grant posting access to the student
    if (status.toUpperCase() === 'APPROVED') {
      await prisma.student.update({
        where: { id: updated.studentId },
        data: { canPost: true },
      });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error in updatePostRequestStatus:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
