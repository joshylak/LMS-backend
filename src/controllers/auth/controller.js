import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ROLES } from "../../config/roles.js";
import { findUserByEmail, users } from "../../data/users.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    role: ROLES.STUDENT,
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, role: newUser.role, email: newUser.email },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(201).json({
    token,
    role: newUser.role,
    name: newUser.name,
    id: newUser.id,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    token,
    role: user.role,
    name: user.name,
    id: user.id,
  });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required" });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ message: "The old password you entered is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  res.status(200).json({ message: "Password updated successfully" });
};
