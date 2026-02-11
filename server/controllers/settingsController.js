const Settings = require('../models/Settings');

// Get single settings document (assume one)
const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

// Upsert school profile & CMS
const upsertSettings = async (req, res) => {
  const update = req.body;
  const settings = await Settings.findOneAndUpdate({}, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  res.json(settings);
};

module.exports = {
  getSettings,
  upsertSettings,
};

