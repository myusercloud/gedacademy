const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, trim: true },
    level: { type: String, trim: true }, // e.g. Grade 1, Form 2
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);

