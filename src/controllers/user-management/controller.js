import bcrypt from "bcryptjs";
import { ROLES } from "../../config/roles.js";
import { findUserByEmail, users } from "../../data/users.js";

export const createAdminOrStaff = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const allowedRoles = [ROLES.ADMIN, ROLES.STAFF];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res.status(400).json({
      message: "Invalid role. This route only creates Admin or Staff accounts.",
    });
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
    role: role.toLowerCase(),
  };

  users.push(newUser);

  res.status(201).json({
    message: `Account created for ${name} as ${role}`,
    temporaryPassword: password,
  });
};
