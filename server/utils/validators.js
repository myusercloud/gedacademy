import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "teacher", "student", "parent").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const studentSchema = Joi.object({
  userId: Joi.string().optional(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  admissionNumber: Joi.string().required(),
  classId: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  address: Joi.string().allow("", null),
  phone: Joi.string().allow("", null),
});

export const teacherSchema = Joi.object({
  userId: Joi.string().optional(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  employeeId: Joi.string().required(),
  subjects: Joi.array().items(Joi.string()).optional(),
  classes: Joi.array().items(Joi.string()).optional(),
  phone: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
});

export const parentSchema = Joi.object({
  userId: Joi.string().optional(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  children: Joi.array().items(Joi.string()).optional(),
  occupation: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  phone: Joi.string().allow("", null),
});
