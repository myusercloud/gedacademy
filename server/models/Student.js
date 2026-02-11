import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admissionNumber: {
      type: String,
      required: true,
      unique: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    address: { type: String },

    phone: { type: String },

    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
      },
    ],

    feesBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
