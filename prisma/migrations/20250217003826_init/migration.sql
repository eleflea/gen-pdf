-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "organisation" TEXT NOT NULL,
    "industrySupervisor" TEXT NOT NULL,
    "datePrepared" TIMESTAMP(3) NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "plansForNextWeek" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "hoursSpent" DOUBLE PRECISION NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "WeeklyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
