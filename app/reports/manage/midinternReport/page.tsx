import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getReports() {
  return await prisma.midInternshipReviewForm.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ManageReportsPage() {
  const reports = await getReports();

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-5">Manage Mid-Internship Reports</h1>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Industry Supervisor</TableHead>
            <TableHead>Date of Visit</TableHead>
            <TableHead>Student Comments</TableHead>
            <TableHead>Student Signature</TableHead>

            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.studentName}</TableCell>
              <TableCell>{report.studentId}</TableCell>
              <TableCell>{report.organization}</TableCell>
              <TableCell>{report.supervisor}</TableCell>
              <TableCell>
                {report.dateOfVisit ? format(report.dateOfVisit, "PP") : "N/A"}
              </TableCell>
              <TableCell>{report.studentComments}</TableCell>
              <TableCell>{report.studentSignature}</TableCell>
              <TableCell>{format(report.createdAt, "PP")}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link href={`/reports/${report.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
