import Subject from "../models/Subject.js";

export const createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json(subject);
};

export const getSubjects = async (req, res) => {
  const subjects = await Subject.find()
    .populate("classes", "name")
    .populate("teachers", "user");

  res.json(subjects);
};

export const getSubjectById = async (req, res) => {
  const subject = await Subject.findById(req.params.id)
    .populate("classes", "name")
    .populate("teachers", "user");

  if (!subject) {
    return res.status(404).json({ message: "Subject not found" });
  }

  res.json(subject);
};

export const updateSubject = async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!subject) {
    return res.status(404).json({ message: "Subject not found" });
  }

  res.json(subject);
};

export const deleteSubject = async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return res.status(404).json({ message: "Subject not found" });
  }

  await subject.deleteOne();

  res.json({ message: "Subject deleted" });
};
