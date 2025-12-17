import bcrypt from "bcryptjs";

// these are mock users for now until db is ready
export const users = [
  {
    id: 1,
    email: "student@school.com",
    password: await bcrypt.hash("password123", 10),
    role: "student",
    name: "John Doe",
  },
  {
    id: 2,
    email: "staff@school.com",
    password: await bcrypt.hash("admin123", 10),
    role: "staff",
    name: "Professor Smith",
  },
];

export const findUserByEmail = (email) => users.find((u) => u.email === email);
