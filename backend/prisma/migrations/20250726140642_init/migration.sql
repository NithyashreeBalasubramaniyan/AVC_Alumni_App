/*
  Warnings:

  - The values [ALUMNI] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `alumniId` on the `Post` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'ALUMINI', 'TEACHER');
ALTER TABLE "Post" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_alumniId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "alumniId",
ADD COLUMN     "aluminiId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_aluminiId_fkey" FOREIGN KEY ("aluminiId") REFERENCES "Alumini"("id") ON DELETE SET NULL ON UPDATE CASCADE;
