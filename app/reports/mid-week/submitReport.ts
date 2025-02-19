import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      studentName,
      studentId,
      organization,
      supervisor,
      dateOfVisit,
      selfAssessment,
      studentComments,
      studentSignature,
    } = req.body;

    try {
      const result = await prisma.midInternshipReport.create({
        data: {
          studentName,
          studentId,
          organization,
          supervisor,
          dateOfVisit: new Date(dateOfVisit),
          selfAssessment,
          studentComments,
          studentSignature,
          industrySupervisorComments: "",
          academicSupervisorComments: "",
        },
      });

      res.status(200).json({ message: "Form submitted successfully!", result });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ message: "Error submitting form", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
