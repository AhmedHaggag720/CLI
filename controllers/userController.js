const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // ✅ Import the User model

// 🔹 Controller function to create a user
async function addUser(req, res) {
  try {
    console.log("📩 Received Request Body:", req.body); // Debugging line

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.addUser(name, email, hashedPassword);
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
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
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
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Confirm old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Old Password" });
    }

    // Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
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

// Get user by ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Update user details
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Hash the  password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.updateUser(id, name, email, hashedPassword);
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Delete a user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Await the user fetch from the database
    const user = await User.getUserById(id);

    // Check if user was found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Proceed with deleting the user if found
    const deletedUser = await User.removeUser(id);

    return res.status(200).json({ success: true, user: deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


// ✅ Export the function so it can be used in routes
module.exports = {
  addUser,
  loginUser,
  changePassword,
  getUserById,
  updateUser,
  deleteUser,
};
