import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { END_OF_TERM_QUESTIONS } from "./utils";

type Task = {
  id: string;
  day: number;
  date: Date;
  description: string;
  hoursSpent: number;
};

export type WeeklyReport = {
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

type ScoreItem = {
  id: string;
  question: string;
  score: number;
};

export type EndOfTermReport = {
  id: string;
  studentName: string;
  studentId: number;
  organisation: string;
  industrySupervisor: string;
  dateOfSubmit: Date;
  scoreItems: ScoreItem[];
  studentComments: string;
  supervisorComments: string;
  studentSignature: string;
  studentSignatureDate: Date;
  supervisorSignature: string | null;
  supervisorSignatureDate: Date | null;
  createdAt: Date;
};

export const generateWeeklyPDF = (report: WeeklyReport) => {
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
    maxWidth - 2 * marginX - 4
  );
  doc.text(splitText, marginX + 4, finalY + 17);

  // Save the PDF
  doc.save(`weekly-report-week-${report.weekNumber}.pdf`);
};

export const generateEndOfTermPDF = (report: EndOfTermReport) => {
  const doc = new jsPDF();
  const marginX = 24;
  const maxWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    "ICT80004 Final Internship Project Review Form - Close",
    marginX,
    30
  );
  doc.setLineWidth(0.5);
  doc.line(marginX, 31, 134, 31);

  // Add School Logo
  const img = new Image();
  img.src = "/swinburne.png";
  doc.addImage(img, "PNG", 150, 10, 36, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("To be submitted to Canvas by week 13.", marginX, 38);

  // Basic Information
  doc.text("Student Name:", marginX, 48);
  doc.text("__________________________", 58, 48);
  doc.text(`${report.studentName}`, 60, 48);

  doc.text("ID:", 140, 48);
  doc.text("_____________________", 145, 48);
  doc.text(`${report.studentId}`, 152, 48);

  doc.text("Organisation:", marginX, 56);
  doc.text("__________________________", 58, 56);
  doc.text(`${report.organisation}`, 60, 56);

  doc.text("Industry Supervisor:", marginX, 64);
  doc.text("__________________________", 58, 64);
  doc.text(`${report.industrySupervisor}`, 60, 64);

  doc.text("Date:", 140, 64);
  doc.text("___________________", 149, 64);
  doc.text(`${format(new Date(report.dateOfSubmit), "PPP")}`, 152, 64);

  doc.setFont("helvetica", "bold");
  doc.text(
    "Rate your current level of knowledge on the following by ticking on the appropriate box.",
    marginX,
    76
  );
  doc.text(
    "(Complete this in consultation with your industry supervisor)",
    marginX,
    81
  );

  // table headers
  const headers = [
    [
      "",
      "I can teach and share this to my colleagues",
      "I know more than enough",
      "I'm happy with what I know",
      "I want to learn more about this",
      "I like to have help on this",
    ],
  ];

  let tableData = END_OF_TERM_QUESTIONS.map((question) => [
    question,
    "",
    "",
    "",
    "",
    "",
  ]);
  const choices = END_OF_TERM_QUESTIONS.map(
    (question) =>
      report.scoreItems.find((item) => item.question === question)?.score ??
      null
  );
  console.log(choices);
  tableData = tableData.map((row, i) => [
    `${i + 1}. ${row[0]}`,
    ...row.slice(1),
  ]);

  // Draw the table
  autoTable(doc, {
    startY: 86,
    margin: { left: marginX, right: marginX },
    head: headers,
    body: tableData,
    theme: "plain",
    styles: {
      fontSize: 9,
      fontStyle: "normal",
      valign: "middle",
      halign: "center",
      lineWidth: 0.25,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: "left", cellWidth: 70 },
    },
    headStyles: {
      minCellHeight: 20,
    },
    bodyStyles: {
      minCellHeight: 10,
    },
    didDrawCell: function (data) {
      if (
        data.section === "head" &&
        data.column.index === 0 &&
        data.row.index === 0
      ) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Your perception", data.cell.x + 40, data.cell.y + 5);
        doc.text("Knowledge", data.cell.x + 5, data.cell.y + 18);
        doc.line(data.cell.x, data.cell.y, data.cell.x + 70, data.cell.y + 20);
      }
      if (data.section === "body" && data.column.index >= 1) {
        const centerX = data.cell.x + data.cell.width / 2;
        const centerY = data.cell.y + data.cell.height / 2;
        doc.circle(centerX, centerY, 2, "S");
        if (
          choices[data.row.index] ===
          choices.length - data.column.index + 1
        ) {
          doc.circle(centerX, centerY, 1.25, "F");
        }
      }
    },
  });

  // Comments
  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Student Comments:", marginX, finalY + 2);
  doc.setLineWidth(0.25);
  doc.rect(marginX, finalY + 4, maxWidth - 2 * marginX, 30);
  const splitStudentComments = doc.splitTextToSize(
    report.studentComments,
    maxWidth - 2 * marginX - 4
  );
  doc.setFont("helvetica", "normal");
  doc.text(splitStudentComments, marginX + 4, finalY + 9);

  doc.setFont("helvetica", "bold");
  doc.text("Supervisor Comments:", marginX, finalY + 42);
  doc.rect(marginX, finalY + 44, maxWidth - 2 * marginX, 30);
  const splitSupervisorComments = doc.splitTextToSize(
    report.supervisorComments,
    maxWidth - 2 * marginX - 4
  );
  doc.setFont("helvetica", "normal");
  doc.text(splitSupervisorComments, marginX + 4, finalY + 49);

  // Signature
  doc.text("Student Signature:", marginX, finalY + 88);
  doc.text("__________________________", marginX + 30, finalY + 88);
  doc.text(report.studentSignature, marginX + 35, finalY + 88);
  doc.text("Date:", marginX + 110, finalY + 88);
  doc.text("_____________________", marginX + 120, finalY + 88);
  doc.text(
    format(new Date(report.studentSignatureDate), "PPP"),
    marginX + 122,
    finalY + 88
  );

  doc.text("Supervisor Signature:", marginX, finalY + 98);
  doc.text("________________________", marginX + 35, finalY + 98);
  doc.text(report.supervisorSignature ?? "", marginX + 38, finalY + 98);
  doc.text("Date:", marginX + 110, finalY + 98);
  doc.text("_____________________", marginX + 120, finalY + 98);
  if (report.supervisorSignatureDate) {
    doc.text(
      format(new Date(report.supervisorSignatureDate), "PPP"),
      marginX + 122,
      finalY + 98
    );
  }

  doc.save(`end-of-term-report-${report.studentName}.pdf`);
};
