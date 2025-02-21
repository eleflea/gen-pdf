import { z } from "zod";
// Define the self-assessment schema for individual entries
export const SelfAssessmentSchema = z.object({
  rating: z.enum([
    "I'm getting the opportunities",
    "I'd love to have more opportunities",
  ]),
  comment: z.string().min(1, "Comment is required"), // Comment is required
});
export const FormSchema = z.object({
  studentName: z.string().min(2, "Student Name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  organization: z.string().min(1, "Organization Name is required"),
  supervisor: z.string().min(1, "Industry Supervisor Name is required"),
  dateOfVisit: z.date().nullable(),
  selfAssessments: z
    .array(SelfAssessmentSchema)
    .length(5, "All self-assessment fields are required"),
  studentComments: z.string().min(1, "Write some comment"),
  studentSignature: z.string().min(1, "Signature is required"),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
export type selfAssessmentType = z.infer<typeof SelfAssessmentSchema>;
