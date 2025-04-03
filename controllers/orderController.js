const { check } = require("express-validator");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// Get Orders by User ID
async function getOrdersByUserId(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.getOrdersByUserId(userId);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Create a new Order
async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { total } = req.body;

    const order = await Order.createOrder(userId, total);
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Add items to the order
async function addItemsToOrder(req, res) {
  try {
    const { orderId, productId, quantity } = req.body;

    const addedItem = await Order.addItemsToOrder(orderId, productId, quantity);
    return res.status(201).json({ success: true, item: addedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Remove an item from the order
async function removeItemFromOrder(req, res) {
  try {
    const { orderId, productId } = req.params;

    const removedItem = await Order.removeItemFromOrder(orderId, productId);
    return res.status(200).json({ success: true, item: removedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function checkout(req, res) {
  try {
    const userId = req.user.id; // Extract user ID from JWT

    // 1. Get all cart items for the user
    const cartItems = await Cart.getCartItems(userId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Calculate total price
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });

    // 3. Create a new order
    const order = await Order.createOrder(userId, totalPrice);
    const orderid = await order.id; 
    // 4. Move cart items to order_items
    await Order.addOrderItems(order.id, cartItems); 

    // 5. Clear the cart
    await Cart.clearCart(userId);

    return res
      .status(201)
      .json({ success: true, message: "Order placed successfully", orderid });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  getOrdersByUserId,
  createOrder,
  addItemsToOrder,
  removeItemFromOrder,
  checkout,
};
