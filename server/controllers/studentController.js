import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import { studentSchema } from "../utils/validators.js";

const SALT_ROUNDS = 10;

// Create student and linked user
export const createStudent = async (req, res) => {
  const { error, value } = studentSchema.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message });

  const {
    userId,
    name,
    email,
    admissionNumber,
    classId,
    dateOfBirth,
    gender,
    address,
    phone,
  } = value;

  let user = null;

  // Link existing user OR create new user
  if (userId) {
    user = await User.findById(userId);
  } else {
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    const tempPassword = admissionNumber;
    const hashed = await bcrypt.hash(tempPassword, SALT_ROUNDS);

    user = await User.create({
      name,
      email,
      password: hashed,
      role: "student",
    });
  }

  // Ensure admission number is unique
  const existingStudent = await Student.findOne({ admissionNumber });
  if (existingStudent) {
    return res
      .status(400)
      .json({ message: "Admission number already exists" });
  }

  const student = await Student.create({
    user: user._id,
    admissionNumber,
    class: classId || null,
    dateOfBirth,
    gender,
    address,
    phone,
  });

  user.student = student._id;
  await user.save();

  if (classId) {
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: student._id },
    });
  }

  res.status(201).json(student);
};

export const getStudents = async (req, res) => {
  const students = await Student.find()
    .populate("user", "name email")
    .populate("class", "name section");

  res.json(students);
};

export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("user", "name email")
    .populate("class", "name section");

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

export const updateStudent = async (req, res) => {
  const student = await Student.findById(req.params.id).populate("user");

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const {
    name,
    email,
    admissionNumber,
    classId,
    dateOfBirth,
    gender,
    address,
    phone,
  } = req.body;

  if (name !== undefined) student.user.name = name;
  if (email !== undefined) student.user.email = email;
  if (admissionNumber !== undefined)
    student.admissionNumber = admissionNumber;
  if (classId !== undefined) student.class = classId;
  if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth;
  if (gender !== undefined) student.gender = gender;
  if (address !== undefined) student.address = address;
  if (phone !== undefined) student.phone = phone;

  await student.user.save();
  await student.save();

  res.json(student);
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const userId = student.user;

  await student.deleteOne();

  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  res.json({ message: "Student deleted" });
};
