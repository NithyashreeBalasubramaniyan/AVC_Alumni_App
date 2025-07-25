/*
  Warnings:

  - You are about to drop the column `is_login` on the `ExistingAlumini` table. All the data in the column will be lost.
  - You are about to drop the column `is_login` on the `ExistingStudent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExistingAlumini" DROP COLUMN "is_login";

-- AlterTable
ALTER TABLE "ExistingStudent" DROP COLUMN "is_login";

-- CreateTable
CREATE TABLE "ExistingTeacher" (
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExistingTeacher_pkey" PRIMARY KEY ("reg_no")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "ph_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_reg_no_key" ON "Teacher"("reg_no");
