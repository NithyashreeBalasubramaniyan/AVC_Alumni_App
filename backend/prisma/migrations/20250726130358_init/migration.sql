-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ALUMNI', 'TEACHER');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "caption" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL,
    "studentId" INTEGER,
    "alumniId" INTEGER,
    "teacherId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumini"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
