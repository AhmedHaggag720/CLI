const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        message: "Access denied. No token provided or incorrect format.",
      });
  }
  const token = authHeader.split(" ")[1]; // Extract token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in req.user
    next(); // Continue to the next middleware or route
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
}


module.exports = authenticateUser;
