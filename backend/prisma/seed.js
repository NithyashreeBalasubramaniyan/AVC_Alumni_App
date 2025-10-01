const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting existing data...');

  // Delete dependent tables first if they exist
  await prisma.Post.deleteMany();
  await prisma.PostRequest.deleteMany();
  await prisma.Student.deleteMany();
  await prisma.Teacher.deleteMany();
  await prisma.Alumni.deleteMany();
  await prisma.ExistingStudent.deleteMany();
  await prisma.ExistingTeacher.deleteMany();
  await prisma.ExistingAlumni.deleteMany();

  console.log('All data deleted.');

  // ---------------------------
  // Departments for reference (if needed later)
  // ---------------------------
  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];

  // ---------------------------
  // 1️⃣ Seed Existing Students
  // ---------------------------
  console.log('Seeding existing students...');
  const existingStudents = [];
  for (let i = 1; i <= 50; i++) {
    existingStudents.push({
      name: `Existing Student ${i}`,
      reg_no: `82023104${String(i).padStart(4,'0')}`, // 12-digit registration
      dob: new Date(`2001-01-${String((i % 28) + 1).padStart(2, '0')}`),
      mail: `existing.student${i}@example.com`,
    });
  }
  await prisma.ExistingStudent.createMany({ data: existingStudents, skipDuplicates: true });
  console.log('Created 50 existing students.');

  // ---------------------------
  // 2️⃣ Seed Existing Teachers
  // ---------------------------
  console.log('Seeding existing teachers...');
  const existingTeachers = [];
  for (let i = 1; i <= 50; i++) {
    existingTeachers.push({
      name: `Existing Teacher ${i}`,
      reg_no: `T${String(1000 + i)}`,
      dob: new Date(`1980-01-${String((i % 28) + 1).padStart(2, '0')}`),
      mail: `existing.teacher${i}@example.com`,
    });
  }
  await prisma.ExistingTeacher.createMany({ data: existingTeachers, skipDuplicates: true });
  console.log('Created 50 existing teachers.');

  // ---------------------------
  // 3️⃣ Seed Existing Alumni
  // ---------------------------
  console.log('Seeding existing alumni...');
  const existingAlumni = [];
  for (let i = 1; i <= 50; i++) {
    existingAlumni.push({
      name: `Existing Alumni ${i}`,
      reg_no: `82023103${String(i).padStart(4,'0')}`, // 12-digit registration
      dob: new Date(`1996-01-${String((i % 28) + 1).padStart(2, '0')}`),
      mail: `existing.alumni${i}@example.com`,
    });
  }
  await prisma.ExistingAlumni.createMany({ data: existingAlumni, skipDuplicates: true });
  console.log('Created 50 existing alumni.');

  console.log('Database seeding of existing data completed successfully!');
}

main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
