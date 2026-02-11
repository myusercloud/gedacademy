const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    occupation: { type: String },
    address: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Parent', parentSchema);

