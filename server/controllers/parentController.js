const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const { parentSchema } = require('../utils/validators');

const SALT_ROUNDS = 10;

const createParent = async (req, res) => {
  const { error, value } = parentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { userId, name, email, children, occupation, address, phone } = value;

  let user = null;
  if (userId) {
    user = await User.findById(userId);
  } else {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User with email already exists' });
    const tempPassword = phone || email;
    const hashed = await bcrypt.hash(tempPassword, SALT_ROUNDS);
    user = await User.create({
      name,
      email,
      password: hashed,
      role: 'parent',
    });
  }

  const parent = await Parent.create({
    user: user._id,
    children: children || [],
    occupation,
    address,
    phone,
  });

  user.parent = parent._id;
  await user.save();

  if (children?.length) {
    await Student.updateMany(
      { _id: { $in: children } },
      { $addToSet: { parents: parent._id } }
    );
  }

  res.status(201).json(parent);
};

const getParents = async (req, res) => {
  const parents = await Parent.find()
    .populate('user', 'name email')
    .populate('children', 'admissionNumber');
  res.json(parents);
};

const getParentById = async (req, res) => {
  const parent = await Parent.findById(req.params.id)
    .populate('user', 'name email')
    .populate('children', 'admissionNumber');
  if (!parent) return res.status(404).json({ message: 'Parent not found' });
  res.json(parent);
};

const updateParent = async (req, res) => {
  const parent = await Parent.findById(req.params.id).populate('user');
  if (!parent) return res.status(404).json({ message: 'Parent not found' });

  const { name, email, children, occupation, address, phone } = req.body;

  if (name !== undefined) parent.user.name = name;
  if (email !== undefined) parent.user.email = email;
  if (children !== undefined) parent.children = children;
  if (occupation !== undefined) parent.occupation = occupation;
  if (address !== undefined) parent.address = address;
  if (phone !== undefined) parent.phone = phone;

  await parent.user.save();
  await parent.save();

  res.json(parent);
};

const deleteParent = async (req, res) => {
  const parent = await Parent.findById(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Parent not found' });

  const userId = parent.user;

  await parent.deleteOne();
  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  res.json({ message: 'Parent deleted' });
};

module.exports = {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
};

