/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `register_number` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reg_no]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dob` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mail` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ph_no` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reg_no` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_register_number_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "date_of_birth",
DROP COLUMN "phone_number",
DROP COLUMN "register_number",
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mail" TEXT NOT NULL,
ADD COLUMN     "ph_no" TEXT NOT NULL,
ADD COLUMN     "reg_no" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExistingAlumini" (
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "is_login" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExistingAlumini_pkey" PRIMARY KEY ("reg_no")
);

-- CreateTable
CREATE TABLE "Alumini" (
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

    CONSTRAINT "Alumini_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alumini_reg_no_key" ON "Alumini"("reg_no");

-- CreateIndex
CREATE UNIQUE INDEX "Student_reg_no_key" ON "Student"("reg_no");
