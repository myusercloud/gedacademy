import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";

import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Parent from "../models/Parent.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import Noticeboard from "../models/Notice.js";
import Settings from "../models/Settings.js";

// Fix .env path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

await connectDB();

console.log("🔥 Seeding Massive School Data...");

// ==========================
// Kenyan Name Generator
// ==========================

const firstNames = [
  "Brian","Kevin","Dennis","Mark","Victor","Mercy","Faith","Grace","Ann",
  "Brenda","Sharon","Purity","Lilian","James","John","Peter","David",
  "Daniel","Samuel","Stephen","Cynthia","Valerie","Caroline","Mary"
];

const lastNames = [
  "Otieno","Mwangi","Kamau","Wanjiku","Kiptoo","Cheruiyot","Mutua",
  "Njoroge","Omondi","Wekesa","Odhiambo","Maina","Karanja",
  "Achieng","Kibet","Chebet","Muriuki","Wafula","Koech"
];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ==========================
// CLEAN DATABASE
// ==========================

await mongoose.connection.dropDatabase();
console.log("🗑 Database Cleared");

// ==========================
// CREATE CLASSES
// ==========================

const classes = [];
for (let i = 1; i <= 8; i++) {
  const c = await Class.create({
    name: `Grade ${i}`,
    level: `Grade ${i}`,
    section: "A",
  });
  classes.push(c);
}

// ==========================
// CREATE SUBJECTS
// ==========================

const subjectNames = [
  "Mathematics","English","Kiswahili","Biology","Chemistry",
  "Physics","History","Geography","CRE","Computer Studies"
];

const subjects = [];
for (let s of subjectNames) {
  const sub = await Subject.create({
    name: s,
    code: s.substring(0, 3).toUpperCase() + randomInt(10, 99),
  });
  subjects.push(sub);
}

// ==========================
// CREATE TEACHERS
// ==========================

const teachers = [];

for (let i = 0; i < 20; i++) {
  const name = `${random(firstNames)} ${random(lastNames)}`;

  const user = await User.create({
    name,
    email: `teacher${i}@school.com`,
    password: await bcrypt.hash("password123", 10),
    role: "teacher",
  });

  const teacher = await Teacher.create({
    user: user._id,
    employeeId: `EMP${1000 + i}`,
  });

  teachers.push(teacher);
}

// ==========================
// CREATE 500 STUDENTS
// ==========================

const students = [];

for (let i = 0; i < 500; i++) {
  const name = `${random(firstNames)} ${random(lastNames)}`;
  const classRef = random(classes);

  const user = await User.create({
    name,
    email: `student${i}@school.com`,
    password: await bcrypt.hash("password123", 10),
    role: "student",
  });

  const student = await Student.create({
    user: user._id,
    admissionNumber: `ADM${10000 + i}`,
    class: classRef._id,
    gender: Math.random() > 0.5 ? "male" : "female",
    dateOfBirth: new Date(2008, randomInt(0,11), randomInt(1,28)),
  });

  students.push(student);
}

console.log("👨‍🎓 500 Students Created");

// ==========================
// CREATE EXAMS (3 Terms)
// ==========================

const exams = [];

for (let term = 1; term <= 3; term++) {
  for (let c of classes) {
    const exam = await Exam.create({
      name: `Term ${term} Exam`,
      term: `Term ${term}`,
      year: 2026,
      class: c._id,
    });
    exams.push(exam);
  }
}

console.log("📝 Exams Created");

// ==========================
// CREATE RESULTS
// ==========================

for (let student of students) {
  for (let exam of exams.filter(e =>
    e.class.toString() === student.class.toString()
  )) {
    for (let subject of subjects) {
      const marks = randomInt(40, 100);

      await Result.create({
        student: student._id,
        exam: exam._id,
        subject: subject._id,
        marks,
        grade:
          marks >= 80 ? "A" :
          marks >= 70 ? "B" :
          marks >= 60 ? "C" :
          marks >= 50 ? "D" : "E",
      });
    }
  }
}

console.log("📊 Results Generated");

// ==========================
// ATTENDANCE (90 Days)
// ==========================

const today = new Date();

for (let i = 0; i < 90; i++) {
  const date = new Date();
  date.setDate(today.getDate() - i);

  for (let student of students) {
    await Attendance.create({
      student: student._id,
      class: student.class,
      date,
      status:
        Math.random() > 0.9 ? "absent" :
        Math.random() > 0.85 ? "late" : "present",
    });
  }
}

console.log("📅 Attendance History Created");

// ==========================
// FEES
// ==========================

for (let student of students) {
  for (let term = 1; term <= 3; term++) {
    const amount = 20000;
    const paid = randomInt(10000, 20000);

    await Fee.create({
      student: student._id,
      term: `Term ${term}`,
      year: 2026,
      amount,
      amountPaid: paid,
      status: paid >= amount ? "paid" : "partial",
    });
  }
}

console.log("💰 Fees Generated");

// ==========================
// SETTINGS
// ==========================

await Settings.create({
  schoolName: "Gedacademy",
  currentTerm: "Term 1",
  currentYear: 2026,
});

console.log("⚙ Settings Created");

console.log("✅ MASSIVE SEED COMPLETE");

process.exit();
