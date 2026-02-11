import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    term: { type: String, required: true }, // e.g. Term 1, Term 2
    year: { type: Number, required: true },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
