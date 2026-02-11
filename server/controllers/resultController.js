const Result = require('../models/Result');
const Student = require('../models/Student');
const Exam = require('../models/Exam');

// Teacher: enter or update marks
const upsertResult = async (req, res) => {
  const { studentId, examId, subjectId, marks, grade, remarks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const exam = await Exam.findById(examId);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const result = await Result.findOneAndUpdate(
    { student: studentId, exam: examId, subject: subjectId },
    { student: studentId, exam: examId, subject: subjectId, marks, grade, remarks },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(result);
};

const getResultsByStudent = async (req, res) => {
  const { studentId } = req.params;
  const results = await Result.find({ student: studentId })
    .populate('exam')
    .populate('subject');
  res.json(results);
};

const getResultsByExam = async (req, res) => {
  const { examId } = req.params;
  const results = await Result.find({ exam: examId })
    .populate('student')
    .populate('subject');
  res.json(results);
};

module.exports = {
  upsertResult,
  getResultsByStudent,
  getResultsByExam,
};

