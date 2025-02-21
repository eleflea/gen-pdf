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
    // Ensure proper parsing of self-assessment JSON
    selfAssessments: formData.get("selfAssessment")
      ? JSON.parse(formData.get("selfAssessment") as string) // Parse the selfAssessment JSON string
      : [],
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
    const report = await prisma.midInternshipReviewForm.create({
      data: {
        studentName: validatedFields.data.studentName,
        studentId: validatedFields.data.studentId,
        organization: validatedFields.data.organization,
        supervisor: validatedFields.data.supervisor,
        dateOfVisit: validatedFields.data.dateOfVisit,
        selfAssessments: validatedFields.data.selfAssessments,
        studentComments: validatedFields.data.studentComments,
        studentSignature: validatedFields.data.studentSignature,
      },
    });

    return { success: true, data: report };
  } catch (error) {
    console.error("Error while submitting report:", error);
    return { success: false, error: "Failed to create report" };
  }
}
