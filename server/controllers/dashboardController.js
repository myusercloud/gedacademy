import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import Result from "../models/Result.js";
import Exam from "../models/Exam.js";
import Settings from "../models/Settings.js";

export const getOverview = async (req, res) => {
  const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Class.countDocuments(),
  ]);

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const [attendanceToday, currentSettings] = await Promise.all([
    Attendance.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } }),
    Settings.findOne(),
  ]);

  const term = currentSettings?.currentTerm;
  const year = currentSettings?.currentYear;

  let feesAggregate = { collected: 0 };

  if (term && year) {
    const fees = await Fee.aggregate([
      { $match: { term, year } },
      {
        $group: {
          _id: null,
          collected: { $sum: "$amountPaid" },
        },
      },
    ]);

    feesAggregate = fees[0] || { collected: 0 };
  }

  // Top performers (avg >= 80 for latest exam)
  const latestExam = await Exam.findOne().sort({ year: -1, createdAt: -1 });

  let topPerformers = [];

  if (latestExam) {
    const results = await Result.aggregate([
      { $match: { exam: latestExam._id } },
      {
        $group: {
          _id: "$student",
          avgMarks: { $avg: "$marks" },
        },
      },
      { $sort: { avgMarks: -1 } },
      { $limit: 10 },
    ]);

    topPerformers = await Student.populate(results, {
      path: "_id",
      select: "admissionNumber",
      populate: { path: "user", select: "name" },
    });
  }

  // Upcoming events (from CMS settings)
  const now = new Date();

  const upcomingEvents =
    currentSettings?.cms?.newsAndEvents?.filter(
      (e) => e.type === "event" && new Date(e.date) >= now
    ) || [];

  res.json({
    totalStudents,
    totalTeachers,
    totalClasses,
    attendanceToday,
    feesCollectedThisTerm: feesAggregate.collected,
    topPerformers,
    upcomingEvents,
  });
};
