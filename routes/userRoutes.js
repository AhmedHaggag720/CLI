const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authMiddleware");

// 🔹 Register Route
router.post("/registerUser", userController.registerUser);

// 🔹 Login Route
router.post("/loginUser", userController.loginUser);

// 🔹 Change Password Route
router.post("/changePassword",authenticateUser, userController.changePassword);


module.exports = router;
