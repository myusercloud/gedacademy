const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Result = require('../models/Result');
const Student = require('../models/Student');
const Exam = require('../models/Exam');
const { generateReportCardPdf } = require('../utils/pdf');

// Student report card JSON
const getStudentReportJson = async (req, res) => {
  const { studentId, examId } = req.params;

  const student = await Student.findById(studentId)
    .populate('user', 'name')
    .populate('class', 'name');
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const exam = await Exam.findById(examId);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const results = await Result.find({ student: studentId, exam: examId }).populate(
    'subject',
    'name code'
  );

  const totalMarks = results.reduce((sum, r) => sum + (r.marks || 0), 0);
  const average = results.length ? totalMarks / results.length : 0;

  res.json({
    student,
    exam,
    results,
    summary: {
      totalMarks,
      average,
    },
  });
};

// Student report card PDF
const getStudentReportPdf = async (req, res) => {
  const { studentId, examId } = req.params;

  const student = await Student.findById(studentId)
    .populate('user', 'name')
    .populate('class', 'name');
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const exam = await Exam.findById(examId);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const results = await Result.find({ student: studentId, exam: examId }).populate(
    'subject',
    'name code'
  );

  const totalMarks = results.reduce((sum, r) => sum + (r.marks || 0), 0);
  const average = results.length ? totalMarks / results.length : 0;

  const { url } = await generateReportCardPdf({
    student,
    exam,
    results,
    summary: {
      totalMarks,
      average,
    },
  });

  res.json({ url });
};

// Attendance summary for student
const getAttendanceSummaryForStudent = async (req, res) => {
  const { studentId } = req.params;
  const { from, to } = req.query;

  const query = { student: studentId };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const records = await Attendance.find(query);
  const summary = records.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, excused: 0 }
  );

  res.json({ summary, count: records.length });
};

// Fees statement for student
const getFeesStatementForStudent = async (req, res) => {
  const { studentId } = req.params;
  const fees = await Fee.find({ student: studentId }).sort({ year: -1, term: 1 });

  const totalBilled = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.amountPaid || 0), 0);

  res.json({
    fees,
    totalBilled,
    totalPaid,
    balance: totalBilled - totalPaid,
  });
};

module.exports = {
  getStudentReportJson,
  getStudentReportPdf,
  getAttendanceSummaryForStudent,
  getFeesStatementForStudent,
};

