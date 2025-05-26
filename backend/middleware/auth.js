import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in .env");
  }

  const authHeader = req.header("Authorization");

  console.log("Auth Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7) // remove "Bearer "
    : authHeader;

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(400).json({ message: "Invalid token" });
  }

  console.log("Parsed Token:", token);
}
