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

    const existingCart = await Cart.getCartByUserId(userId);

    if (existingCart) {
      return res
        .status(400)
        .json({ success: false, message: "User already has an existing cart" });
    }
    const cartId = await Cart.createCart(userId);
    req.user.cartId = cartId;
    return res.status(201).json({ success: true, cartId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Add Item to Cart
async function addItemToCart(req, res) {
  try {
    const userId = req.user.id; // Extract userId from JWT token
    const { product_Id, quantity, price } = req.body;

    // Check if the user already has a cart
    const cart = await Cart.getCartByUserId(userId);

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "User does not have an existing cart",
      });
    }

    const cartId = cart.id; // Get the cart_id from the existing cart

    // Check if the product already exists in the cart
    const existingItem = await Cart.getItemInCart(cartId, product_Id);

    if (existingItem) {
      // If the item exists, update the quantity
      const updatedItem = await Cart.updateItemQuantity(
        cartId,
        product_Id,
        Number(existingItem.quantity) + Number(quantity)
      );
      return res.status(200).json({ success: true, item: updatedItem });
    }

    // If the item doesn't exist, add it to the cart
    const addedItem = await Cart.addItemToCart(
      cartId,
      product_Id,
      quantity,
      price
    );
    return res.status(201).json({ success: true, item: addedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Remove Item from Cart
async function removeItemFromCart(req, res) {
  try {
    const {productId} = req.params;
    const userId = req.user.id; // Extract userId from JWT token

    // Fetch the cart from the database

    const cart = await Cart.getCartByUserId(userId); // Assuming Cart.findById fetches the cart

    // Check if the cart exists and if the userId matches
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    if (cart.user_id !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You do not have permission to modify this cart",
        });
    }

    // Remove the item from the cart
    const removedItem = await Cart.removeItemFromCart(cart.id, productId);

    if (!removedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    return res.status(200).json({ success: true, item: removedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Delete Cart
async function deleteCart(req, res) {
  try {
    const { cartId } = req.params;
    const userId = req.user.id; // Extract userId from JWT token

    // Fetch the cart by its ID
    const cart = await Cart.findById(cartId);

    // Check if the cart exists
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Check if the cart belongs to the user
    if (cart.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this cart",
      });
    }

    // Delete the cart
    const deleted = await Cart.deleteCart(cartId);

    if (!deleted) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete cart" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  getCartByUserId,
  createCart,
  addItemToCart,
  removeItemFromCart,
  deleteCart,
};
