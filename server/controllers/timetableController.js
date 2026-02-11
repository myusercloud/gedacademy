import Timetable from "../models/Timetable.js";

export const createTimetable = async (req, res) => {
  const timetable = await Timetable.create(req.body);
  res.status(201).json(timetable);
};

export const getTimetablesByClass = async (req, res) => {
  const { classId } = req.params;

  const timetables = await Timetable.find({ class: classId })
    .populate("periods.subject")
    .populate("periods.teacher");

  res.json(timetables);
};

export const updateTimetable = async (req, res) => {
  const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!timetable) {
    return res.status(404).json({ message: "Timetable not found" });
  }

  res.json(timetable);
};

export const deleteTimetable = async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return res.status(404).json({ message: "Timetable not found" });
  }

  await timetable.deleteOne();

  res.json({ message: "Timetable deleted" });
};
