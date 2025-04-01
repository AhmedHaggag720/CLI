// cartController.js

const Cart = require("../models/cartModel");

// Get Cart By User ID
async function getCartByUserId(req, res) {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.getCartByUserId(userId);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const items = await Cart.getCartItems(cart.id);
    return res.status(200).json({ success: true, cart, items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Create a new Cart
async function createCart(req, res) {
  try {
    const userId = req.user.id;

    const existingCart  = await Cart.getCartByUserId(userId);

    if (existingCart) {
      return res
        .status(400)
        .json({ success: false, message: "User already has an existing cart" });
    }
    const cartId = await Cart.createCart(userId);
    return res.status(201).json({ success: true, cartId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Add Item to Cart
async function addItemToCart(req, res) {
  try {
    const { cartId, productId, quantity } = req.body;

    const addedItem = await Cart.addItemToCart(cartId, productId, quantity);
    return res.status(201).json({ success: true, item: addedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Remove Item from Cart
async function removeItemFromCart(req, res) {
  try {
    const { cartId, productId } = req.params;

    const removedItem = await Cart.removeItemFromCart(cartId, productId);
    return res.status(200).json({ success: true, item: removedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  getCartByUserId,
  createCart,
  addItemToCart,
  removeItemFromCart,
};
