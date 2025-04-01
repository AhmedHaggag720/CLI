const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authMiddleware");
const {validateLogin , validateUser} = require("../middlewares/validator");

// 🔹 Register Route
router.post("/registerUser",validateUser, userController.registerUser);

// 🔹 Login Route
router.post("/loginUser",validateLogin, userController.loginUser);

// 🔹 Change Password Route
router.post("/changePassword",authenticateUser, userController.changePassword);


module.exports = router;
