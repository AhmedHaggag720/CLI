const pool = require("../config/db");

const Cart = {
  // Get Cart By User ID
  async getCartByUserId(userId) {
    const query = `SELECT * FROM Carts WHERE user_id = $1`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the cart or null if not found
    } catch (error) {
      throw error;
    }
  },

  // Function to find a cart by its ID
  async findById(cartId) {
    try {
      const query = "SELECT * FROM carts WHERE id = $1";
      const result = await pool.query(query, [cartId]); // Executes the query with the cartId

      if (result.rows.length === 0) {
        return null; // If no cart is found, return null
      }

      return result.rows[0]; // Return the first result (cart)
    } catch (error) {
      console.error("Error finding cart by ID:", error);
      throw new Error("Database error");
    }
  },

  // Create a new Cart
  async createCart(userId) {
    const query = `INSERT INTO Carts (user_id) VALUES ($1) RETURNING id`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0].id; // Return the new cart ID
    } catch (error) {
      throw error;
    }
  },

  // Add Item to Cart
  async addItemToCart(cart_Id, product_Id, quantity) {
    const query = `
      INSERT INTO Cart_Items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [cart_Id, product_Id, quantity];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the newly added item
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
      return result.rows[0]; // Return the removed item data
    } catch (error) {
      throw error;
    }
  },

  async deleteCart(cartId) {
    try {
      const query = "DELETE FROM carts WHERE id = $1";
      const result = await pool.query(query, [cartId]);

      return result.rowCount > 0; // Returns true if a row was deleted
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw new Error("Database error");
    }
  },
  // Get Items in a Cart
  async getCartItems(cartId) {
    const query = `SELECT * FROM Cart_Items WHERE cart_id = $1`;
    const values = [cartId];
    try {
      const result = await pool.query(query, values);
      return result.rows; // Return all cart items
    } catch (error) {
      throw error;
    }
  },

  async getItemInCart(cartId, productId) {
    const query = `
      SELECT * FROM Cart_Items 
      WHERE cart_id = $1 AND product_id = $2`;
    const values = [cartId, productId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the first row if found, otherwise null
    } catch (error) {
      throw error;
    }
  },

  async updateItemQuantity(cartId, productId, newQuantity) {
    const query = `
      UPDATE Cart_Items
      SET quantity = $1
      WHERE cart_id = $2 AND product_id = $3
      RETURNING *`; // This will return the updated row
    const values = [newQuantity, cartId, productId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the updated item
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Cart;
