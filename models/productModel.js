const pool = require("../config/db");

const Product = {
  // Get All Products
  async getAllProducts() {
    const query = `SELECT * FROM Products`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get Product By ID
  async getProductById(id) {
    const query = `SELECT * FROM Products WHERE id = $1`;
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the first result (or null if not found)
    } catch (error) {
      throw error;
    }
  },

  // Add a new Product
  async addProduct(name, price, description) {
    const query = `
      INSERT INTO Products (name, price, description)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [name, price, description];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the new product data
    } catch (error) {
      throw error;
    }
  },

  // Update an existing Product
  async updateProduct(id, name, price, description) {
    const query = `
      UPDATE Products
      SET name = $1, price = $2, description = $3
      WHERE id = $4
      RETURNING *`;
    const values = [name, price, description, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the updated product data
    } catch (error) {
      throw error;
    }
  },

  // Remove a Product
  async removeProduct(id) {
    const query = `DELETE FROM Products WHERE id = $1 RETURNING *`;
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the removed product data
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Product;
