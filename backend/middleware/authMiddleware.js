import User from "../models/userModal.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    res.status(401).json({
      message: "Token failed",
      error: err.message,
    });
  }
};
