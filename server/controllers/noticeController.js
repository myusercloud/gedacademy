const Noticeboard = require('../models/Notice');

const createNotice = async (req, res) => {
  const notice = await Noticeboard.create({
    ...req.body,
    createdBy: req.user?._id,
  });
  res.status(201).json(notice);
};

const getNotices = async (req, res) => {
  const { audience } = req.query;
  const now = new Date();
  const filter = {
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  };
  if (audience) {
    filter.audience = { $in: [audience, 'public'] };
  }
  const notices = await Noticeboard.find(filter).sort({ createdAt: -1 });
  res.json(notices);
};

const deleteNotice = async (req, res) => {
  const notice = await Noticeboard.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  await notice.deleteOne();
  res.json({ message: 'Notice deleted' });
};

module.exports = {
  createNotice,
  getNotices,
  deleteNotice,
};

