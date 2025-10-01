/*
  Warnings:

  - Added the required column `department` to the `PostRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PostRequest" ADD COLUMN     "department" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "department" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Teacher" ADD COLUMN     "department" TEXT NOT NULL;
