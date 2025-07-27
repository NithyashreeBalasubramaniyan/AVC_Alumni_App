-- CreateTable
CREATE TABLE "ExistingStudent" (
    "name" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "is_login" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExistingStudent_pkey" PRIMARY KEY ("reg_no")
);
