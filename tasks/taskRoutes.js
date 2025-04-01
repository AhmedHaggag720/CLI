const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticateUser = require("../middlewares/authMiddleware");

// 🔹 Create Task Route
router.post("/createTask", authenticateUser, taskController.createTask);

// 🔹 List Tasks Route
router.get("/listTasks", authenticateUser, taskController.listTasks);

// 🔹 Update Tasks Route
router.put("/updateTask/:taskId", authenticateUser, taskController.updateTask);

// 🔹 Delete Task Route
router.delete("/deleteTask/:taskId", authenticateUser, taskController.deleteTask);

// 🔹 Search Task Route
router.get("/searchTasks", authenticateUser, taskController.searchTasks);


module.exports = router;
