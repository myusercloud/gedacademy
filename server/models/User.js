import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: { type: Date },

    refreshToken: { type: String },

    resetPasswordToken: { type: String },

    resetPasswordExpires: { type: Date },

    // Relation shortcuts
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
