"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Download, FileCheck, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteReport, signReport } from "@/app/actions/reports";
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: string;
  day: number;
  date: Date;
  description: string;
  hoursSpent: number;
};

type Report = {
  id: string;
  studentName: string;
  studentId: number;
  organisation: string;
  industrySupervisor: string;
  datePrepared: Date;
  weekNumber: number;
  tasks: Task[];
  plansForNextWeek: string;
  totalHours: number;
  isSigned: boolean;
  createdAt: Date;
};

type Props = {
  initialReports: Report[];
};

export function ManageReportsClient({ initialReports }: Props) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteReport(id);
      if (!result.success) {
        throw new Error(result.error);
      }

      setReports((prev) => prev.filter((report) => report.id !== id));
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const handleSign = async (id: string) => {
    try {
      const result = await signReport(id);
      if (!result.success) {
        throw new Error(result.error);
      }

      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, isSigned: true } : report
        )
      );
      toast({
        title: "Success",
        description: "Report signed successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign report",
        variant: "destructive",
      });
    }
  };

  const generatePDF = (report: Report) => {
    const doc = new jsPDF();

    const marginX = 24;
    const maxWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ICT80004 Weekly Communication", marginX, 30, {});
    doc.setLineWidth(0.5);
    doc.line(marginX, 31, 103, 31);

    // Add School Logo
    const img = new Image();
    img.src = "/swinburne.png"; // Replace with actual path or base64 string
    doc.addImage(img, "PNG", 150, 10, 36, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "To be submitted to Canvas together with a screenshot of the email sending this to your supervisor.",
      marginX,
      38
    );

    // Basic Information
    doc.text("Student Name:", marginX, 48);
    doc.text("__________________________", 58, 48);
    doc.text(`${report.studentName}`, 60, 48);

    doc.text("ID:", 140, 48);
    doc.text("__________________", 145, 48);
    doc.text(`${report.studentId}`, 152, 48);

    doc.text("Organisation:", marginX, 56);
    doc.text("__________________________", 58, 56);
    doc.text(`${report.organisation}`, 60, 56);

    doc.text("Industry Supervisor:", marginX, 64);
    doc.text("__________________________", 58, 64);
    doc.text(`${report.industrySupervisor}`, 60, 64);

    doc.text("Date Prepared:", marginX, 72);
    doc.text("__________________________", 58, 72);
    doc.text(`${format(new Date(report.datePrepared), "PPP")}`, 60, 72);

    doc.text("Internship Week #:", 140, 72);
    doc.text("_____", 170, 72);
    doc.text(`${report.weekNumber}`, 172, 72);

    // Tasks Table
    autoTable(doc, {
      startY: 80,
      margin: { left: marginX, right: marginX },
      head: [["Day", "Date", "Task(s) Ongoing and/or Completed", "Hours"]],
      body: report.tasks.map((task) => [
        task.day,
        format(new Date(task.date), "PPP"),
        task.description,
        task.hoursSpent,
      ]),
      theme: "plain",
      headStyles: {
        fontStyle: "normal",
        halign: "center",
      },
      styles: {
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { halign: "center" },
        3: { halign: "center" },
      },
      tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
    });

    // Total Hours
    const finalY =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;
    doc.text(
      "Total hours completed for the week: ________________",
      marginX,
      finalY
    );
    doc.text(`${report.totalHours}`, 95, finalY);

    // Plans for Next Week
    doc.text(
      "Plans for next week (include notes on extra days, absences and make up days if applicable)",
      marginX,
      finalY + 10
    );
    doc.setLineWidth(0.25);
    doc.rect(marginX, finalY + 12, maxWidth - 2 * marginX, 30); // Placeholder box for plans
    const splitText = doc.splitTextToSize(
      report.plansForNextWeek,
      maxWidth - 2 * marginX - 8
    );
    doc.text(splitText, marginX + 4, finalY + 17);

    // Save the PDF
    doc.save(`weekly-report-week-${report.weekNumber}.pdf`);
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Manage Reports</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Date Prepared</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>Week {report.weekNumber}</TableCell>
                <TableCell>{report.studentName}</TableCell>
                <TableCell>
                  {format(new Date(report.datePrepared), "PPP")}
                </TableCell>
                <TableCell>{report.totalHours}</TableCell>
                <TableCell>
                  {report.isSigned ? (
                    <span className="text-green-600">Signed</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => generatePDF(report)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {!report.isSigned && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSign(report.id)}
                      >
                        <FileCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this report? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(report.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
