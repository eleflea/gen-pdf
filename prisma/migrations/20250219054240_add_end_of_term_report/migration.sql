-- CreateTable
CREATE TABLE "EndOfTermReport" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "organisation" TEXT NOT NULL,
    "industrySupervisor" TEXT NOT NULL,
    "dateOfSubmit" TIMESTAMP(3) NOT NULL,
    "studentComments" TEXT NOT NULL,
    "supervisorComments" TEXT NOT NULL,
    "studentSignature" TEXT NOT NULL,
    "studentSignatureDate" TIMESTAMP(3) NOT NULL,
    "supervisorSignature" TEXT,
    "supervisorSignatureDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EndOfTermReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreItem" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "ScoreItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScoreItem" ADD CONSTRAINT "ScoreItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "EndOfTermReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
