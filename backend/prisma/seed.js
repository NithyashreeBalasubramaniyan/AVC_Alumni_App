const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  
  // Create a sample student
  await prisma.existingStudent.createMany({
    "data": [{
    "name": "Student",
    "reg_no": "1111",
    "dob": new Date("2000-01-01"),
    "mail": "Student@gmail.com"
  },
  {
    "name": "Student2",
    "reg_no": "2222",
    "dob": new Date("2000-01-01"),
    "mail": "Student2@gmail.com"
  }
  ]   
  })

  await prisma.existingalumni.createMany({
    "data": [{
    "name": "alumni",
    "reg_no": "1111",
    "dob": new Date("2000-01-01"),
    "mail": "alumni@gmail.com"
  },
  {
    "name": "alumni2",
    "reg_no": "2222",
    "dob": new Date("2000-01-01"),
    "mail": "alumni@gmail.com"
  }
  ]   
  })

  await prisma.existingTeacher.createMany({
    "data": [{
    "name": "teacher",
    "reg_no": "1111",
    "dob": new Date("2000-01-01"),
    "mail": "teacher@gmail.com"
  },
  {
    "name": "teacher2",
    "reg_no": "2222",
    "dob": new Date("2000-01-01"),
    "mail": "teacher2@gmail.com"
  }
  ]   
  })

  console.log('Sample student created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 