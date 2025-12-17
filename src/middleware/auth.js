import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("authenticatin error ==>", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (allowedRoles) => (req, res, next) => {
  const rolesArray = [allowedRoles].flat();

  if (!rolesArray.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Requires: ${rolesArray.join(" or ")}`,
    });
  }

  next();
};
