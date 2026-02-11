import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";

// Teacher: mark attendance for a student
export const markAttendance = async (req, res) => {
  const { studentId, classId, date, status, remarks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const cls = await Class.findById(classId || student.class);
  if (!cls) {
    return res.status(404).json({ message: "Class not found" });
  }

  const recordDate = date ? new Date(date) : new Date();

  const attendance = await Attendance.findOneAndUpdate(
    { student: studentId, date: recordDate.toDateString() },
    {
      student: studentId,
      class: cls._id,
      date: recordDate,
      status: status || "present",
      markedBy: req.user?.teacher || null,
      remarks,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(attendance);
};

// Get attendance for a student
export const getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const { from, to } = req.query;

  const query = { student: studentId };

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const records = await Attendance.find(query).sort({ date: 1 });
  res.json(records);
};

// Attendance summary for a class/day
export const getAttendanceSummary = async (req, res) => {
  const { classId } = req.params;
  const { date } = req.query;

  const targetDate = date ? new Date(date) : new Date();

  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const records = await Attendance.find({
    class: classId,
    date: { $gte: dayStart, $lte: dayEnd },
  });

  const summary = records.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, excused: 0 }
  );

  res.json({
    date: dayStart,
    summary,
    count: records.length,
  });
};
