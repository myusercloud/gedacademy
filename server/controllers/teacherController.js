import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import { teacherSchema } from "../utils/validators.js";

const SALT_ROUNDS = 10;

export const createTeacher = async (req, res) => {
  const { error, value } = teacherSchema.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message });

  const {
    userId,
    name,
    email,
    employeeId,
    subjects,
    classes,
    phone,
    address,
  } = value;

  let user = null;

  if (userId) {
    // Link existing user
    user = await User.findById(userId);
  } else {
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }

    const tempPassword = employeeId;
    const hashed = await bcrypt.hash(tempPassword, SALT_ROUNDS);

    user = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher",
    });
  }

  // Check employee ID uniqueness
  const existingTeacher = await Teacher.findOne({ employeeId });
  if (existingTeacher) {
    return res
      .status(400)
      .json({ message: "Employee ID already exists" });
  }

  const teacher = await Teacher.create({
    user: user._id,
    employeeId,
    subjects: subjects || [],
    classes: classes || [],
    phone,
    address,
  });

  user.teacher = teacher._id;
  await user.save();

  // Update class-teacher relationships
  if (classes?.length) {
    await Class.updateMany(
      { _id: { $in: classes } },
      { $addToSet: { teachers: teacher._id } }
    );
  }

  // Update subject-teacher relationships
  if (subjects?.length) {
    await Subject.updateMany(
      { _id: { $in: subjects } },
      { $addToSet: { teachers: teacher._id } }
    );
  }

  res.status(201).json(teacher);
};

export const getTeachers = async (req, res) => {
  const teachers = await Teacher.find()
    .populate("user", "name email")
    .populate("subjects", "name code")
    .populate("classes", "name section");

  res.json(teachers);
};

export const getTeacherById = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate("user", "name email")
    .populate("subjects", "name code")
    .populate("classes", "name section");

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  res.json(teacher);
};

export const updateTeacher = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate("user");

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const {
    name,
    email,
    employeeId,
    subjects,
    classes,
    phone,
    address,
  } = req.body;

  if (name !== undefined) teacher.user.name = name;
  if (email !== undefined) teacher.user.email = email;
  if (employeeId !== undefined) teacher.employeeId = employeeId;
  if (subjects !== undefined) teacher.subjects = subjects;
  if (classes !== undefined) teacher.classes = classes;
  if (phone !== undefined) teacher.phone = phone;
  if (address !== undefined) teacher.address = address;

  await teacher.user.save();
  await teacher.save();

  res.json(teacher);
};

export const deleteTeacher = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const userId = teacher.user;

  await teacher.deleteOne();

  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  res.json({ message: "Teacher deleted" });
};
