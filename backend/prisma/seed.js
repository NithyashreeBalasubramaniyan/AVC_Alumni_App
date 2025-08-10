const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ----------------------------------------------------------------
  // 1. Clear all existing data from the database
  // ----------------------------------------------------------------
  // Deleting in a specific order to respect relationships
  console.log('Deleting existing data...');
  await prisma.post.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.alumni.deleteMany();
  await prisma.existingStudent.deleteMany();
  await prisma.existingTeacher.deleteMany();
  await prisma.existingalumni.deleteMany();
  console.log('All data deleted.');

  // ----------------------------------------------------------------
  // 2. Seed Existing Students (10 records)
  // ----------------------------------------------------------------
  console.log('Seeding existing students...');
  const existingStudents = [];
  for (let i = 1; i <= 10; i++) {
    existingStudents.push({
      name: `Existing Student ${i}`,
      // Updated to generate a 12-digit registration number
      reg_no: `8203231040${String(i).padStart(2, '0')}`,
      dob: new Date(`2001-01-${String(i).padStart(2, '0')}`),
      mail: `existing.student${i}@example.com`,
    });
  }
  await prisma.existingStudent.createMany({ data: existingStudents, skipDuplicates: true });
  console.log('Created 10 existing students.');

  // ----------------------------------------------------------------
  // 3. Seed Existing Teachers (10 records)
  // ----------------------------------------------------------------
  console.log('Seeding existing teachers...');
  const existingTeachers = [];
  for (let i = 1; i <= 10; i++) {
    existingTeachers.push({
      name: `Existing Teacher ${i}`,
      reg_no: `T${String(1000 + i)}`,
      dob: new Date(`1980-01-${String(i).padStart(2, '0')}`),
      mail: `existing.teacher${i}@example.com`,
    });
  }
  await prisma.existingTeacher.createMany({ data: existingTeachers , skipDuplicates: true});
  console.log('Created 10 existing teachers.');

  // ----------------------------------------------------------------
  // 4. Seed Existing Alumni (10 records)
  // ----------------------------------------------------------------
  console.log('Seeding existing alumni...');
  const existingAlumni = [];
  for (let i = 1; i <= 10; i++) {
    existingAlumni.push({
      name: `Existing Alumni ${i}`,
      // Updated to generate a 12-digit registration number
      reg_no: `8203181040${String(i).padStart(2, '0')}`,
      dob: new Date(`1996-01-${String(i).padStart(2, '0')}`),
      mail: `existing.alumni${i}@example.com`,
    });
  }
  await prisma.existingalumni.createMany({ data: existingAlumni, skipDuplicates: true });
  console.log('Created 10 existing alumni.');

  // ----------------------------------------------------------------
  // 5. Create 5 verified Student profiles from Existing Students
  // ----------------------------------------------------------------
  console.log('Creating 5 student profiles...');
  const studentProfiles = [];
  for (let i = 1; i <= 5; i++) {
    studentProfiles.push({
      name: `Existing Student ${i}`,
      // Updated to generate a 12-digit registration number
      reg_no: `8203231040${String(i).padStart(2, '0')}`,
      ph_no: `987654321${i}`,
      dob: new Date(`2001-01-${String(i).padStart(2, '0')}`),
      mail: `existing.student${i}@example.com`,
      password: `$2a$10$5Se05lyzSpqMWYQEY5ItiuNHWj.65l1eWD0i/NZ.57FoZm0cwTYYq`,
      job_role: 'Software Engineer Intern',
      Company: 'Startup Inc.',
      profile_image: `/uploads/${i}.jpg`,
      Gender: i % 2 === 0 ? 'Female' : 'Male',
      is_verified: true,
    });
  }
  await prisma.student.createMany({ data: studentProfiles, skipDuplicates: true });
  console.log('Created 5 student profiles.');

  // ----------------------------------------------------------------
  // 6. Create 5 verified Teacher profiles from Existing Teachers
  // ----------------------------------------------------------------
  console.log('Creating 5 teacher profiles...');
  const teacherProfiles = [];
  for (let i = 1; i <= 5; i++) {
    teacherProfiles.push({
      name: `Existing Teacher ${i}`,
      reg_no: `T${String(1000 + i)}`,
      ph_no: `876543210${i}`,
      dob: new Date(`1980-01-${String(i).padStart(2, '0')}`),
      mail: `existing.teacher${i}@example.com`,
      password: `$2a$10$5Se05lyzSpqMWYQEY5ItiuNHWj.65l1eWD0i/NZ.57FoZm0cwTYYq`,
      job_role: 'Professor',
      profile_image: `/uploads/${i}.jpg`,
      Experience: `${5 + i} years`,
      Gender: i % 2 === 0 ? 'Male' : 'Female',
      is_verified: true,
    });
  }
  await prisma.teacher.createMany({ data: teacherProfiles, skipDuplicates: true });
  console.log('Created 5 teacher profiles.');

  // ----------------------------------------------------------------
  // 7. Create 5 verified Alumni profiles from Existing Alumni
  // ----------------------------------------------------------------
  console.log('Creating 5 alumni profiles...');
  const alumniProfiles = [];
  for (let i = 1; i <= 5; i++) {
    alumniProfiles.push({
      name: `Existing Alumni ${i}`,
      // Updated to generate a 12-digit registration number
      reg_no: `8203181040${String(i).padStart(2, '0')}`,
      ph_no: `765432109${i}`,
      dob: new Date(`1996-01-${String(i).padStart(2, '0')}`),
      mail: `existing.alumni${i}@example.com`,
      password: `$2a$10$5Se05lyzSpqMWYQEY5ItiuNHWj.65l1eWD0i/NZ.57FoZm0cwTYYq`,
      job_role: 'Senior Developer',
      Company: 'Big Tech LLC',
      profile_image: `/uploads/${i}.jpg`,
      Experience: `${i} years`,
      Gender: i % 2 === 0 ? 'Female' : 'Male',
      is_verified: true,
    });
  }
  await prisma.alumni.createMany({ data: alumniProfiles , skipDuplicates: true});
  console.log('Created 5 alumni profiles.');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('An error occurred during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
