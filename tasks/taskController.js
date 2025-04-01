const Task = require("../models/taskModel"); // ✅ Import the User model

// 🔹 Controller function to create a user
async function createTask(req, res) {
  try {
    console.log("📩 Received Request Body:", req.body); // Debugging line

    const { title, description, due_date, status } = req.body;

    if (!title || !description || !due_date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user_id = req.user.id;
    const newTask = await Task.createTask(
      title,
      description,
      due_date,
      status,
      user_id
    );
    res.status(201).json({ success: true, Task: newTask });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function listTasks(req, res) {
  try {
    const user_id = req.user.id; // Get userId from query params

    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const existingTasks = await Task.listTasks(user_id);

    if (existingTasks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found for this user" });
    }

    res.status(201).json({ success: true, Tasks: existingTasks });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    const { title, description, due_date, status } = req.body;
    const userId = req.user.id; // Extract user ID from JWT

    // Check if the task exists and belongs to the logged-in user
    const existingTask = await Task.findTaskById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (existingTask.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can't update this task" });
    }

    // Validate fields before updating
    if (!title || !description || !due_date || status === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate due_date format
    if (isNaN(Date.parse(due_date))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }

    // Update task in the database
    const updatedTask = await Task.updateTask(
      title,
      description,
      due_date,
      status,
      taskId
    );

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const existingTask = await Task.findTaskById(taskId);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (existingTask.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can't delete this task" });
    }

    // Delete the task from the database
    await Task.deleteTask(taskId);
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function searchTasks(req, res) {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    const { keyword } = req.query; // Extract search parameters

    // Call the model function to search tasks
    const tasks = await Task.searchTasks(userId,keyword);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("❌ Error searching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ Export the function so it can be used in routes
module.exports = { createTask, listTasks, updateTask, deleteTask, searchTasks };
