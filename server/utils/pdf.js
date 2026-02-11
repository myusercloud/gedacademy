import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a simple PDF report card and save to /uploads/reports
export const generateReportCardPdf = async ({ student, exam, results, summary }) => {
  const uploadsDir = path.join(__dirname, "..", "..", "uploads", "reports");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `report-${student._id}-${exam._id}.pdf`;
  const filepath = path.join(uploadsDir, filename);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  doc.fontSize(18).text("Student Report Card", { align: "center" }).moveDown();

  doc
    .fontSize(12)
    .text(`Student: ${student.user?.name || ""}`)
    .text(`Admission No: ${student.admissionNumber}`)
    .text(`Class: ${student.class?.name || ""}`)
    .moveDown();

  doc.text(`Exam: ${exam.name}`).text(`Term: ${exam.term} ${exam.year}`).moveDown();

  doc.fontSize(14).text("Subject Results").moveDown(0.5);

  results.forEach((r) => {
    doc
      .fontSize(12)
      .text(
        `${r.subject.name}: ${r.marks} (${r.grade || "-"}) - ${r.remarks || ""}`
      );
  });

  doc.moveDown().fontSize(14).text("Summary").moveDown(0.5);
  doc.fontSize(12).text(`Total Marks: ${summary.totalMarks}`);
  doc.text(`Average: ${summary.average.toFixed(2)}`);
  doc.text(`Position: ${summary.position || "-"}`);

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { filename, url: `/uploads/reports/${filename}` };
};
