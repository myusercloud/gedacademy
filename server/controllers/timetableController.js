const Timetable = require('../models/Timetable');

const createTimetable = async (req, res) => {
  const timetable = await Timetable.create(req.body);
  res.status(201).json(timetable);
};

const getTimetablesByClass = async (req, res) => {
  const { classId } = req.params;
  const timetables = await Timetable.find({ class: classId }).populate('periods.subject periods.teacher');
  res.json(timetables);
};

const updateTimetable = async (req, res) => {
  const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
  res.json(timetable);
};

const deleteTimetable = async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
  await timetable.deleteOne();
  res.json({ message: 'Timetable deleted' });
};

module.exports = {
  createTimetable,
  getTimetablesByClass,
  updateTimetable,
  deleteTimetable,
};

