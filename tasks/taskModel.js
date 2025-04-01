const pool = require("../config/db");
const { updateTask, searchTasks } = require("../controllers/taskController");

const Task = {
  // 🔹 Create a New Task
  async createTask(title, description, due_date, status, user_id) {
    const query = `
            INSERT INTO tasks (title, description, due_date, status , user_id) 
            VALUES ($1, $2, $3 ,$4 ,$5 ) 
            RETURNING *;
        `;
    const values = [title, description, due_date, status, user_id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async listTasks(user_id) {
    const query = `SELECT * FROM tasks WHERE user_id = $1;`;
    const values = [user_id];

    try {
      const result = await pool.query(query, values);
      return result.rows; // Return user if found
    } catch (error) {
      console.error("❌ Error finding tasks:", error);
      throw error;
    }
  },

  async findTaskById(id) {
    const query = `SELECT * FROM tasks WHERE id = $1;`;
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return user if found
    } catch (error) {
      console.error("❌ Error finding task:", error);
      throw error;
    }
  },

  async updateTask(title, description, due_date, status, taskId) {
    const query = `
        UPDATE tasks 
        SET title = $1, description = $2, due_date = $3, status = $4
        WHERE id = $5
        RETURNING *;
    `;
    const values = [title, description, due_date, status, taskId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating task:", error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    const query = `DELETE FROM tasks WHERE id=$1 RETURNING *;`;
    const values = [taskId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      throw error;
    }
  },

  async searchTasks(userId, keyword) {
    const query = `
      SELECT * FROM tasks
      WHERE user_id = $1 
      AND (title ILIKE $2 OR description ILIKE $2);
    `;
    const values = [userId, `%${keyword}%`]; // Using ILIKE for case-insensitive search
  
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("❌ Error searching tasks by keyword:", error);
      throw error;
    }
  }
  


};

module.exports = Task;
