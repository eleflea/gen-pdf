-- CreateTable
CREATE TABLE "MidInternshipReport" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,
    "dateOfVisit" TIMESTAMP(3),
    "selfAssessment" TEXT[],
    "studentComments" TEXT NOT NULL,
    "studentSignature" TEXT NOT NULL,
    "industrySupervisorComments" TEXT,
    "academicSupervisorComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MidInternshipReport_pkey" PRIMARY KEY ("id")
);
