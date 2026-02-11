const Message = require('../models/Message');
const User = require('../models/User');

// Teacher or parent send message
const sendMessage = async (req, res) => {
  const { toUserId, relatedStudentId, content } = req.body;
  const toUser = await User.findById(toUserId);
  if (!toUser) return res.status(404).json({ message: 'Recipient not found' });

  const message = await Message.create({
    from: req.user._id,
    to: toUserId,
    relatedStudent: relatedStudentId || null,
    content,
  });

  res.status(201).json(message);
};

// Get conversation between logged in user and another user
const getConversation = async (req, res) => {
  const { otherUserId } = req.params;
  const messages = await Message.find({
    $or: [
      { from: req.user._id, to: otherUserId },
      { from: otherUserId, to: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('from to', 'name role');

  res.json(messages);
};

// Get inbox for logged in user
const getInbox = async (req, res) => {
  const messages = await Message.find({ to: req.user._id })
    .sort({ createdAt: -1 })
    .populate('from', 'name role');
  res.json(messages);
};

module.exports = {
  sendMessage,
  getConversation,
  getInbox,
};

