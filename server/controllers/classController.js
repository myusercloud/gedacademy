const Class = require('../models/Class');

const createClass = async (req, res) => {
  const cls = await Class.create(req.body);
  res.status(201).json(cls);
};

const getClasses = async (req, res) => {
  const classes = await Class.find()
    .populate('classTeacher', 'user')
    .populate('students', 'admissionNumber')
    .populate('subjects', 'name code');
  res.json(classes);
};

const getClassById = async (req, res) => {
  const cls = await Class.findById(req.params.id)
    .populate('classTeacher', 'user')
    .populate('students', 'admissionNumber')
    .populate('subjects', 'name code');
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  res.json(cls);
};

const updateClass = async (req, res) => {
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  res.json(cls);
};

const deleteClass = async (req, res) => {
  const cls = await Class.findById(req.params.id);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  await cls.deleteOne();
  res.json({ message: 'Class deleted' });
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};

