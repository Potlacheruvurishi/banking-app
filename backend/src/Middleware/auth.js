import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      console.error("Invalid JWT token:", err.message);
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

export default authMiddleware;