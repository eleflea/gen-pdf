"use server";

import { PrismaClient, WeeklyReport, Task } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export type CreateReportTask = Pick<
  Task,
  "day" | "date" | "description" | "hoursSpent"
>;

export type CreateReportData = Pick<
  WeeklyReport & { tasks: CreateReportTask[] },
  | "studentName"
  | "studentId"
  | "organisation"
  | "industrySupervisor"
  | "datePrepared"
  | "weekNumber"
  | "plansForNextWeek"
  | "totalHours"
  | "tasks"
>;

export async function createReport(data: CreateReportData) {
  try {
    const report = await prisma.weeklyReport.create({
      data: {
        studentName: data.studentName,
        studentId: data.studentId,
        organisation: data.organisation,
        industrySupervisor: data.industrySupervisor,
        datePrepared: data.datePrepared,
        weekNumber: data.weekNumber,
        plansForNextWeek: data.plansForNextWeek,
        totalHours: data.totalHours,
        tasks: {
          create: data.tasks.map((task: CreateReportTask) => ({
            day: task.day,
            date: task.date,
            description: task.description,
            hoursSpent: task.hoursSpent,
          })),
        },
      },
      include: {
        tasks: true,
      },
    });

    revalidatePath("/reports/manage");
    return { success: true, data: report };
  } catch (error) {
    console.error("Error creating report:", error);
    return { success: false, error: "Failed to create report" };
  }
}

export async function getReports() {
  try {
    const reports = await prisma.weeklyReport.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { success: false, data: [], error: "Failed to fetch reports" };
  }
}

export async function deleteReport(id: string) {
  try {
    await prisma.weeklyReport.delete({
      where: { id },
    });
    revalidatePath("/reports/manage");
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { success: false, error: "Failed to delete report" };
  }
}

export async function signReport(id: string) {
  try {
    const report = await prisma.weeklyReport.update({
      where: { id },
      data: { isSigned: true },
    });
    revalidatePath("/reports/manage");
    return { success: true, data: report };
  } catch (error) {
    console.error("Error signing report:", error);
    return { success: false, error: "Failed to sign report" };
  }
}

export type CreateScoreItem = {
  question: string;
  score: number;
};

export type CreateEndOfTermReportData = {
  studentName: string;
  studentId: number;
  organisation: string;
  industrySupervisor: string;
  dateOfSubmit: Date;
  studentComments: string;
  supervisorComments: string;
  studentSignature: string;
  studentSignatureDate: Date;
  scoreItems: CreateScoreItem[];
};

export async function createEndOfTermReport(data: CreateEndOfTermReportData) {
  try {
    const report = await prisma.endOfTermReport.create({
      data: {
        ...data,
        scoreItems: {
          create: data.scoreItems,
        },
      },
      include: {
        scoreItems: true,
      },
    });

    revalidatePath("/reports/manage");
    return { success: true, data: report };
  } catch (error) {
    console.error("Error creating end-of-term report:", error);
    return { success: false, error: "Failed to create end-of-term report" };
  }
}

export async function getEndOfTermReports() {
  try {
    const reports = await prisma.endOfTermReport.findMany({
      include: {
        scoreItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error fetching end-of-term reports:", error);
    return { success: false, data: [], error: "Failed to fetch end-of-term reports" };
  }
}

export async function deleteEndOfTermReport(id: string) {
  try {
    await prisma.endOfTermReport.delete({
      where: { id },
    });
    revalidatePath("/reports/manage");
    return { success: true };
  } catch (error) {
    console.error("Error deleting end-of-term report:", error);
    return { success: false, error: "Failed to delete end-of-term report" };
  }
}

export async function signEndOfTermReport(id: string, signature: string) {
  try {
    const report = await prisma.endOfTermReport.update({
      where: { id },
      data: { 
        supervisorSignature: signature,
        supervisorSignatureDate: new Date(),
      },
    });
    revalidatePath("/reports/manage");
    return { success: true, data: report };
  } catch (error) {
    console.error("Error signing end-of-term report:", error);
    return { success: false, error: "Failed to sign end-of-term report" };
  }
}
