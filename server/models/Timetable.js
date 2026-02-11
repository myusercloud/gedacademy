import mongoose from "mongoose";

const periodSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    dayOfWeek: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      required: true,
    },

    periods: [periodSchema],
  },
  { timestamps: true }
);

timetableSchema.index({ class: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.model("Timetable", timetableSchema);
