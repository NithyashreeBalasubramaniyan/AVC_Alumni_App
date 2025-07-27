/*
  Warnings:

  - The values [ALUMINI] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `aluminiId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Alumini` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExistingAlumini` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'alumni', 'TEACHER');
ALTER TABLE "Post" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_aluminiId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "aluminiId",
ADD COLUMN     "alumniId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "job_role" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "job_role" TEXT;

-- DropTable
DROP TABLE "Alumini";

-- DropTable
DROP TABLE "ExistingAlumini";

-- CreateTable
CREATE TABLE "Existingalumni" (
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Existingalumni_pkey" PRIMARY KEY ("reg_no")
);

-- CreateTable
CREATE TABLE "alumni" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "ph_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "job_role" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alumni_reg_no_key" ON "alumni"("reg_no");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni"("id") ON DELETE SET NULL ON UPDATE CASCADE;
