"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Download, FileCheck, Trash2 } from "lucide-react";

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
import {
  deleteEndOfTermReport,
  deleteWeeklyReport,
  signEndOfTermReport,
  signWeeklyReport,
} from "@/app/actions/reports";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateEndOfTermPDF, generateWeeklyPDF } from "@/lib/generate-pdf";
import type { EndOfTermReport, WeeklyReport } from "@/lib/generate-pdf";

type Props = {
  initialWeeklyReports: WeeklyReport[];
  initialEndOfTermReports: EndOfTermReport[];
};

export function ManageReportsClient({
  initialWeeklyReports,
  initialEndOfTermReports,
}: Props) {
  const [weeklyReports, setWeeklyReports] =
    useState<WeeklyReport[]>(initialWeeklyReports);
  const [endOfTermReports, setEndOfTermReports] = useState<EndOfTermReport[]>(
    initialEndOfTermReports
  );
  const { toast } = useToast();

  const handleDelete = async (type: "weekly" | "endofterm", id: string) => {
    const deleteReportFunctionMap = {
      weekly: deleteWeeklyReport,
      endofterm: deleteEndOfTermReport,
    } as const;
    const deleteReport = deleteReportFunctionMap[type];

    try {
      const result = await deleteReport(id);
      if (!result.success) {
        throw new Error(result.error);
      }

      switch (type) {
        case "weekly":
          setWeeklyReports((prev) => prev.filter((report) => report.id !== id));
          break;
        case "endofterm":
          setEndOfTermReports((prev) =>
            prev.filter((report) => report.id !== id)
          );
          break;
      }
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

  const handleSign = async (
    type: "weekly" | "endofterm",
    id: string,
    signature: string
  ) => {
    const signReportFunctionMap = {
      weekly: signWeeklyReport,
      endofterm: signEndOfTermReport,
    } as const;
    const signReport = signReportFunctionMap[type];

    try {
      const result = await signReport(id, signature);
      if (!result.success) {
        throw new Error(result.error);
      }

      switch (type) {
        case "weekly":
          setWeeklyReports((prev) =>
            prev.map((report) =>
              report.id === id ? { ...report, isSigned: true } : report
            )
          );
          break;
        case "endofterm":
          setEndOfTermReports((prev) =>
            prev.map((report) =>
              report.id === id
                ? {
                    ...report,
                    supervisorSignature: "Callum Bir",
                    supervisorSignatureDate: new Date(),
                  }
                : report
            )
          );
          break;
      }
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

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Manage Reports</h1>
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
          <TabsTrigger value="endofterm">End of Term Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
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
                {weeklyReports.map((report) => (
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
                          onClick={() => generateWeeklyPDF(report)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {!report.isSigned && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSign("weekly", report.id, "")}
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
                                Are you sure you want to delete this report?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete("weekly", report.id)
                                }
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
        </TabsContent>
        <TabsContent value="endofterm">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Date Prepared</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endOfTermReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.studentName}</TableCell>
                    <TableCell>
                      {format(new Date(report.dateOfSubmit), "PPP")}
                    </TableCell>
                    <TableCell>
                      {report.supervisorSignature ? (
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
                          onClick={() => generateEndOfTermPDF(report)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {!report.supervisorSignature && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleSign("endofterm", report.id, "Callum Bir")
                            }
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
                                Are you sure you want to delete this end of term
                                report? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete("endofterm", report.id)
                                }
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
