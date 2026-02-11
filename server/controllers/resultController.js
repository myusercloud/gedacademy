import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Exam from "../models/Exam.js";

// Teacher: enter or update marks
export const upsertResult = async (req, res) => {
  const { studentId, examId, subjectId, marks, grade, remarks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const result = await Result.findOneAndUpdate(
    { student: studentId, exam: examId, subject: subjectId },
    {
      student: studentId,
      exam: examId,
      subject: subjectId,
      marks,
      grade,
      remarks,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(201).json(result);
};

export const getResultsByStudent = async (req, res) => {
  const { studentId } = req.params;

  const results = await Result.find({ student: studentId })
    .populate("exam")
    .populate("subject");

  res.json(results);
};

export const getResultsByExam = async (req, res) => {
  const { examId } = req.params;

  const results = await Result.find({ exam: examId })
    .populate("student")
    .populate("subject");

  res.json(results);
};
