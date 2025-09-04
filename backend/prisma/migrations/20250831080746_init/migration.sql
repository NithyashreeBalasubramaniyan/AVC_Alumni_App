/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `PostRequest` table. All the data in the column will be lost.
  - You are about to drop the column `Batch` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Bio` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Company` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Experience` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Gender` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Linkedin_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `allpost` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `job_role` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Existingalumni` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alumni` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_alumniId_fkey";

-- AlterTable
ALTER TABLE "public"."PostRequest" DROP COLUMN "updatedAt",
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "Batch",
DROP COLUMN "Bio",
DROP COLUMN "Company",
DROP COLUMN "Experience",
DROP COLUMN "Gender",
DROP COLUMN "Linkedin_id",
DROP COLUMN "allpost",
DROP COLUMN "created_at",
DROP COLUMN "is_verified",
DROP COLUMN "job_role",
DROP COLUMN "profile_image",
DROP COLUMN "updated_at",
ADD COLUMN     "canPost" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."Existingalumni";

-- DropTable
DROP TABLE "public"."alumni";

-- CreateTable
CREATE TABLE "public"."ExistingAlumni" (
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExistingAlumni_pkey" PRIMARY KEY ("reg_no")
);

-- CreateTable
CREATE TABLE "public"."Alumni" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "ph_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "job_role" TEXT,
    "Linkedin_id" TEXT,
    "profile_image" TEXT,
    "Batch" TEXT,
    "Experience" TEXT,
    "Bio" TEXT,
    "Gender" TEXT,
    "Company" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_reg_no_key" ON "public"."Alumni"("reg_no");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "public"."Alumni"("id") ON DELETE SET NULL ON UPDATE CASCADE;
