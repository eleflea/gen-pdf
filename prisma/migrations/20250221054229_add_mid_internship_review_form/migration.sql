/*
  Warnings:

  - You are about to drop the `MidInternshipReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MidInternshipReport";

-- CreateTable
CREATE TABLE "MidInternshipReviewForm" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,
    "dateOfVisit" TIMESTAMP(3),
    "studentComments" TEXT NOT NULL,
    "studentSignature" TEXT NOT NULL,
    "selfAssessments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MidInternshipReviewForm_pkey" PRIMARY KEY ("id")
);
