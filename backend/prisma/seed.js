const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const password = await bcrypt.hash('securepassword', 10);

  // Create a sample student
  await prisma.student.upsert({
    where: { register_number: '820322104059' },
    update: {},
    create: {
      name: 'Vimal Dharshan',
      register_number: '820322104059',
      phone_number: '9842764239',
      date_of_birth: new Date('2005-01-02'),
      password: password,
      is_verified: true,
    },
  });

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