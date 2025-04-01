const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/authMiddleware");
const {validateLogin , validateUser} = require("../middlewares/validator");

// 🔹 Register Route
router.post("/addUser",validateUser, userController.addUser);

// 🔹 Login Route
router.post("/loginUser",validateLogin, userController.loginUser);

// 🔹 Change Password Route
router.post("/changePassword",authenticateUser, userController.changePassword);

// Route to get user by ID
router.get('/:id', userController.getUserById);

// Route to update user
router.put('/:id', validateUser, userController.updateUser);

// Route to delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
