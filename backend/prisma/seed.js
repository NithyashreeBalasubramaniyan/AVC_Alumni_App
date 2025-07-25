const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  
  // Create a sample alumini
  await prisma.ExistingAlumini.create({
    data: {
    name: "alumini1",
    reg_no: "12345",
    dob: new Date("2000-01-01"),
    mail: "alumini1@gmail.com"
  }
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