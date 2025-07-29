const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  
  // Create a sample student
  // await prisma.existingStudent.createMany({
  //   "data": [{
  //   "name": "Student",
  //   "reg_no": "111111111111",
  //   "dob": new Date("2000-01-01"),
  //   "mail": "Student@gmail.com"
  // },
  // {
  //   "name": "Student2",
  //   "reg_no": "222222222222",
  //   "dob": new Date("2000-01-01"),
  //   "mail": "Student2@gmail.com"
  // }
  // ]   
  // })

  // await prisma.existingalumni.createMany({
  //   "data": [{
  //   "name": "alumni",
  //   "reg_no": "111111111111",
  //   "dob": new Date("2000-01-01"),
  //   "mail": "alumni@gmail.com"
  // },
  // {
  //   "name": "alumni2",
  //   "reg_no": "222222222222",
  //   "dob": new Date("2000-01-01"),
  //   "mail": "alumni@gmail.com"
  // }
  // ]   
  // })

  // await prisma.existingTeacher.createMany({
  //   "data": [{
  //   "name": "teacher",
  //   "reg_no": "1111",
  //   "dob": new Date("2000-01-01"),
  //   "mail": "teacher@gmail.com"
  // },
  // {
  //   "name": "teacher2",
  //   "reg_no": "2222",
  //   "dob": new Date("2000-01-01"),
  //   "mail": "teacher2@gmail.com"
  // }
  // ]   
  // })

//   await prisma.student.createMany({
//     data: [
//   {
//     name: "Arjun R",
//     reg_no: "21CSE001",
//     ph_no: "9876543210",
//     dob: new Date("2001-04-10"),
//     mail: "arjunr@example.com",
//     password: "hashed_password_1",
//     job_role: "Software Engineer",
//     Linkedin_id: "https://linkedin.com/in/arjunr",
//     Experience: "1 year",
//     Gender: "Male",
//     Company: "Infosys",
//     profile_image: "/uploads/arjun.jpg"
//   },
//   {
//     name: "Meena S",
//     reg_no: "21CSE002",
//     ph_no: "9876543211",
//     dob: new Date("2001-06-15"),
//     mail: "meenas@example.com",
//     password: "hashed_password_2",
//     job_role: "UI/UX Designer",
//     Linkedin_id: "https://linkedin.com/in/meenas",
//     Experience: "2 years",
//     Gender: "Female",
//     Company: "TCS",
//     profile_image: "/uploads/meena.jpg"
//   },
//   {
//     name: "Vignesh K",
//     reg_no: "21CSE003",
//     ph_no: "9876543212",
//     dob: new Date("2000-12-01"),
//     mail: "vigneshk@example.com",
//     password: "hashed_password_3",
//     job_role: "Backend Developer",
//     Linkedin_id: "https://linkedin.com/in/vigneshk",
//     Experience: "1.5 years",
//     Gender: "Male",
//     Company: "Zoho",
//     profile_image: "/uploads/vignesh.jpg"
//   },
//   {
//     name: "Sneha R",
//     reg_no: "21CSE004",
//     ph_no: "9876543213",
//     dob: new Date("2001-03-22"),
//     mail: "snehar@example.com",
//     password: "hashed_password_4",
//     job_role: "QA Engineer",
//     Linkedin_id: "https://linkedin.com/in/snehar",
//     Experience: "6 months",
//     Gender: "Female",
//     Company: "Capgemini",
//     profile_image: "/uploads/sneha.jpg"
//   },
//   {
//     name: "Hari V",
//     reg_no: "21CSE005",
//     ph_no: "9876543214",
//     dob: new Date("2000-09-18"),
//     mail: "hariv@example.com",
//     password: "hashed_password_5",
//     job_role: "DevOps Engineer",
//     Linkedin_id: "https://linkedin.com/in/hariv",
//     Experience: "2 years",
//     Gender: "Male",
//     Company: "Wipro",
//     profile_image: "/uploads/hari.jpg"
//   }
// ]
  // })

// await prisma.post.deleteMany()


  await prisma.post.createMany({
    data: [
  {
    caption: "Exploring new opportunities at Infosys!",
    image: "/uploads/post(1).JPEG",
    role: "STUDENT",
    studentId: 1
  },
  {
    caption: "Thrilled to share my recent design at TCS!",
    image: "/uploads/post(2).JPEG",
    role: "STUDENT",
    studentId: 2
  },
  {
    caption: "Backend systems are fun to build!",
    image: "/uploads/post(3).JPEG",
    role: "STUDENT",
    studentId: 3
  },
  {
    caption: "QA is all about perfection. Loving my job!",
    image: "/uploads/post(4).JPEG",
    role: "STUDENT",
    studentId: 4
  },
  {
    caption: "DevOps journey has been amazing so far.",
    image: "/uploads/post(5).JPEG",
    role: "STUDENT",
    studentId: 5
  }
]
})


  console.log('created post created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 