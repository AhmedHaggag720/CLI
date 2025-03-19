const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // ✅ Import the User model

// 🔹 Controller function to create a user
async function registerUser(req, res) {
  try {
    console.log("📩 Received Request Body:", req.body); // Debugging line

    const { name, email, password } = req.body;

    // Check user entries
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.registerUser(name, email, hashedPassword);
    console.log("✅ User Created Successfully:", newUser);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// 🔹 Login user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Short expiry
    );

    res.json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// change user password
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Confirm old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Old Password" });
    }

    // Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password_hash
    );
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the old password",
      });
    }

    // Confirm new password matches confirmation
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirmation do not match" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    await User.updatePassword(userId, hashedPassword);

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ Export the function so it can be used in routes
module.exports = { registerUser, loginUser, changePassword };
