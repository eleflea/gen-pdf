import { z } from "zod";

export const FormSchema = z.object({
  studentName: z.string().min(2, "Student Name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  organization: z.string().min(1, "Organization Name is required"),
  supervisor: z.string().min(1, "Industry Supervisor Name is required"),
  dateOfVisit: z.date().nullable(),
  selfAssessment: z
    .array(z.string().min(1, "All self-assessment fields are required"))
    .length(5, "All self-assessment fields are required"),
  studentComments: z.string().min(1, "Write some comment"),
  studentSignature: z.string().min(1, "Signature is required"),
  supervisorComments: z.string().optional(),
  supervisorSignature: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
