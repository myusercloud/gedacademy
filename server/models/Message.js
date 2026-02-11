import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    relatedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    content: { type: String, required: true },

    readAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
