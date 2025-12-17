import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { ROLES } from "../config/roles.js";
import { users } from "./users.js";

export const initializeAdmin = async () => {
  const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  users.push({
    id: 99,
    email: env.ADMIN_EMAIL,
    password: hashedPassword,
    name: "System Admin",
    role: ROLES.ADMIN,
  });

  console.log(`Admin account initialized: ${env.ADMIN_EMAIL}`);
};
