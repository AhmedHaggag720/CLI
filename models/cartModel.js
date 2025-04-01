const pool = require("../config/db");

const Cart = {
  // Get Cart By User ID
  async getCartByUserId(userId) {
    const query = `SELECT * FROM Carts WHERE user_id = $1`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the cart or null if not found
    } catch (error) {
      throw error;
    }
  },

  // Create a new Cart
  async createCart(userId) {
    const query = `INSERT INTO Carts (user_id) VALUES ($1) RETURNING id`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0].id;  // Return the new cart ID
    } catch (error) {
      throw error;
    }
  },

  // Add Item to Cart
  async addItemToCart(cartId, productId, quantity) {
    const query = `
      INSERT INTO Cart_Items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [cartId, productId, quantity];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the newly added item
    } catch (error) {
      throw error;
    }
  },

  // Remove Item from Cart
  async removeItemFromCart(cartId, productId) {
    const query = `
      DELETE FROM Cart_Items WHERE cart_id = $1 AND product_id = $2
      RETURNING *`;
    const values = [cartId, productId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the removed item data
    } catch (error) {
      throw error;
    }
  },

  // Get Items in a Cart
  async getCartItems(cartId) {
    const query = `SELECT * FROM Cart_Items WHERE cart_id = $1`;
    const values = [cartId];
    try {
      const result = await pool.query(query, values);
      return result.rows;  // Return all cart items
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Cart;
