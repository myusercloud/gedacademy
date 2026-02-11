const Exam = require('../models/Exam');

const createExam = async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
};

const getExams = async (req, res) => {
  const exams = await Exam.find().populate('class', 'name');
  res.json(exams);
};

const getExamById = async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate('class', 'name');
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  res.json(exam);
};

const updateExam = async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  res.json(exam);
};

const deleteExam = async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  await exam.deleteOne();
  res.json({ message: 'Exam deleted' });
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};

