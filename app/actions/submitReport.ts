"use server";
import { prisma } from "@/lib/prisma";
import { FormSchema } from "../reports/mid-week/mid-intern-reportschema";

export async function createMidInternReport(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    studentName: formData.get("studentName"),
    studentId: formData.get("studentId"),
    organization: formData.get("organization"),
    supervisor: formData.get("supervisor"),
    dateOfVisit: formData.get("dateOfVisit")
      ? new Date(formData.get("dateOfVisit") as string)
      : null,
    selfAssessment: formData.getAll("selfAssessment"),
    studentComments: formData.get("studentComments"),
    studentSignature: formData.get("studentSignature"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const report = await prisma.midInternshipReport.create({
      data: validatedFields.data,
    });
    return { success: true, data: report };
  } catch (error) {
    console.log("Error while submitting report:", error);
    return { success: false, error: "Failed to create report" };
  }
}
