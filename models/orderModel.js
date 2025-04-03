const pool = require("../config/db");

const Order = {
  // Get Orders by User ID
  async getOrdersByUserId(userId) {
    const query = `SELECT * FROM Orders WHERE user_id = $1`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows; // Return all orders for the user
    } catch (error) {
      throw error;
    }
  },

  // Create a new Order
  async createOrder(userId, total) {
    const query = `
      INSERT INTO Orders (user_id, total)
      VALUES ($1, $2)
      RETURNING *`;
    const values = [userId, total];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the newly created order
    } catch (error) {
      throw error;
    }
  },

  // Get Order By ID
  async getOrderById(id) {
    const query = `SELECT * FROM Orders WHERE id = $1`;
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the order or null if not found
    } catch (error) {
      throw error;
    }
  },

  // Add Items to Order
  async addItemsToOrder(orderId, productId, quantity) {
    const query = `
      INSERT INTO Order_Items (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [orderId, productId, quantity];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the newly added item
    } catch (error) {
      throw error;
    }
  },

  // Remove an Item from an Order
  async removeItemFromOrder(orderId, productId) {
    const query = `
      DELETE FROM Order_Items WHERE order_id = $1 AND product_id = $2
      RETURNING *`;
    const values = [orderId, productId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the removed item data
    } catch (error) {
      throw error;
    }
  },

  async addOrderItems(orderId, cartItems) {
    try {
      const query = `
        INSERT INTO order_items (order_Id, product_Id, quantity, price)
        VALUES ($1, $2, $3, $4);
      `;

      // Loop through the cartItems and insert each item into order_items
      const promises = cartItems.map(async (item) => {
        // Insert each cart item into the order_items table
        await pool.query(query, [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
        ]);
      });

      // Wait for all the insertions to complete
      await Promise.all(promises);
    } catch (error) {
      console.error("Error adding order items:", error);
      throw new Error("Database error");
    }
  },
};

module.exports = Order;
