import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

resultSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);
