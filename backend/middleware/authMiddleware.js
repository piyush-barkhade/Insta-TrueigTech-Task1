import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ msg: "User not found (token valid but user deleted)" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
