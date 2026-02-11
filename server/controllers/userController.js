import User from "../models/User.js";

// Admin: list all users
export const getUsers = async (req, res) => {
  const users = await User.find().select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );

  res.json(users);
};

// Admin: get single user
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpires"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// Admin: update user basic fields
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, role, isActive } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });
};

// Admin: delete user
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.json({ message: "User deleted" });
};
