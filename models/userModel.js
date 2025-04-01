const pool = require("../config/db");

const User = {
  async addUser(name, email, password) {
    const query = `
            INSERT INTO users (name, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
    const values = [name, email, password];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return user if found
    } catch (error) {
      console.error("❌ Error finding user:", error);
      throw error;
    }
  },

  async getUserById(id) {
    const query = `SELECT * FROM users WHERE id = $1;`;
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return user if found
    } catch (error) {
      console.error("❌ Error finding user:", error);
      throw error;
    }
  },

  async updatePassword(id, newPassword) {
    const query = "UPDATE users SET password =$1 WHERE id =$2 RETURNING id, name, email;";
    const values = [newPassword, id];

    try {
      const result = await pool.query(query, values);
      console.log("✅ Password Changed successfully for id:", id);
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating password:", error);
      throw error;
    }
  },
   // Update User Information
   async updateUser(id, name, email, password) {
    const query = `
      UPDATE Users
      SET name = $1, email = $2, password = $3
      WHERE id = $4
      RETURNING *`;
    const values = [name, email, password, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the updated user data
    } catch (error) {
      throw error;
    }
  },

  // Remove User
  async removeUser(id) {
    const query = `DELETE FROM Users WHERE id = $1 RETURNING *`;
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the removed user data
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;
