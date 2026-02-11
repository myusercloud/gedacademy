import mongoose from "mongoose";

const homepageSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. hero, features
    title: { type: String },
    content: { type: String },
  },
  { _id: false }
);

const newsEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["news", "event"], default: "news" },
    content: { type: String },
  },
  { _id: false }
);

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String },
    imageUrl: { type: String, required: true },
    category: { type: String },
  },
  { _id: false }
);

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    photoUrl: { type: String },
    bio: { type: String },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    logoUrl: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    currentTerm: { type: String },
    currentYear: { type: Number },
    gradingScale: { type: Object },

    cms: {
      homepageSections: [homepageSectionSchema],
      aboutContent: { type: String },
      newsAndEvents: [newsEventSchema],
      gallery: [galleryItemSchema],
      staffList: [staffSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
