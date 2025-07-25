// config/database.js (no longer needed, you can delete this file)

// In your controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example: Register Student
const registerStudent = async (req, res) => {
  // ...validation code...
  const { name, register_number, phone_number, date_of_birth, password } = req.body;

  // Check if student exists
  const existingStudent = await prisma.student.findFirst({
    where: {
      OR: [
        { register_number },
        { phone_number }
      ]
    }
  });
  if (existingStudent) {
    return res.status(400).json({ success: false, message: 'Student already exists...' });
  }

  // Hash password, then:
  const student = await prisma.student.create({
    data: {
      name,
      register_number,
      phone_number,
      date_of_birth: new Date(date_of_birth),
      password: hashedPassword
    }
  });

  // ...rest of your logic...
};