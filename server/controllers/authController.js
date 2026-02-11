import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { blacklistToken } from "../utils/tokenBlacklist.js";
import { sendEmail } from "../utils/email.js";
import { registerSchema, loginSchema } from "../utils/validators.js";

const SALT_ROUNDS = 10;

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Admin can register any role; others restricted
export const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, role } = value;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  // Only allow creating admin when there is no admin or current user is admin
  if (role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0 && (!req.user || req.user.role !== "admin")) {
      return res
        .status(403)
        .json({ message: "Only admin can create another admin" });
    }
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};

export const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message });

  const { email, password } = value;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};

export const refresh = async (req, res) => {
  const token =
    req.body.refreshToken || req.cookies?.refreshToken;

  if (!token)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);

    setAuthCookies(res, accessToken, token);

    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  const accessTokenHeader = req.headers.authorization;

  let accessToken =
    accessTokenHeader && accessTokenHeader.startsWith("Bearer ")
      ? accessTokenHeader.split(" ")[1]
      : req.cookies?.accessToken;

  const refreshToken =
    req.body.refreshToken || req.cookies?.refreshToken;

  if (accessToken) blacklistToken(accessToken);
  if (refreshToken) blacklistToken(refreshToken);

  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) {
    // Avoid user enumeration
    return res.json({
      message: "If that email exists, a reset link has been sent",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(
    email
  )}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });

  res.json({
    message: "If that email exists, a reset link has been sent",
  });
};

export const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    return res
      .status(400)
      .json({ message: "Token, email and password are required" });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired token" });
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  user.password = hashed;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

export const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};
