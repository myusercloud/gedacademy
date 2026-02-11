import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    occupation: { type: String },
    address: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);
