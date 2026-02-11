import Settings from "../models/Settings.js";

// Get single settings document (assume only one)
export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

// Upsert school profile & CMS
export const upsertSettings = async (req, res) => {
  const update = req.body;

  const settings = await Settings.findOneAndUpdate({}, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  res.json(settings);
};
